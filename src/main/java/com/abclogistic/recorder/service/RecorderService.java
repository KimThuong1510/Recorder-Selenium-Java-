package com.abclogistic.recorder.service;
import com.abclogistic.recorder.model.TestCommand;
import com.abclogistic.recorder.model.TestScript;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class RecorderService {
    private final TestScript script = new TestScript();
    private boolean isRecording = false;
    private WebDriver driver;

    public void injectRecorderJs() {
        String js = """
        window.recordedSteps = [];

        function getSelector(el) {
            if (!el) return "";
            let path = el.tagName.toLowerCase();
            if (el.id) path += "#" + el.id;
            if (el.className && typeof el.className === 'string') {
                path += "." + el.className.trim().replace(/\\s+/g, ".");
            }
            return path;
        }
        document.addEventListener('click', function(e) {
            let target = getSelector(e.target);
            window.recordedSteps.push({
                command: "click",
                target: target,
                value: ""
            });
        }, true);

        document.addEventListener('input', function(e) {
            let target = getSelector(e.target);
            let value = e.target.value || "";
            window.recordedSteps.push({
                command: "type",
                target: target,
                value: value
            });
        }, true);""";

        try {
            if (driver != null) {
                ((JavascriptExecutor) driver).executeScript(js);
            }
        } catch (WebDriverException e) {
            System.err.println("Không thể inject JS: " + e.getMessage());
        }
    }

    public void startRecording(String url) {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        isRecording = true;
        driver.get(url);
        script.addCommand(new TestCommand("open", url, ""));
        injectRecorderJs();
    }

    public WebDriver getDriver() {
        return driver;
    }

   public void stopRecording() {
       if (driver != null) {
           driver.quit();
           driver = null;
           isRecording = false;
       }
   }

    public boolean isRecording() {
        return isRecording;
    }
    
    public boolean isDriverActive() {
        if (driver == null) {
            return false;
        }
        
        try {
            driver.getTitle(); // Thử truy cập để kiểm tra driver còn hoạt động
            return true;
        } catch (Exception e) {
            // Driver đã bị đóng thủ công
            return false;
        }
    }
    
    public void resetRecordingState() {
        driver = null;
        isRecording = false;
    }


    public TestScript getCurrentScript() {
        return script;
    }

    public void recordCommand(String command, String target, String value) {
        TestCommand cmd = new TestCommand(command, target, value);
        script.addCommand(cmd);
    }

    public void syncStepsFromBrowser() {
        if (driver == null || !isRecording) {
            System.err.println("Không thể đồng bộ: trình duyệt đã đóng hoặc chưa khởi chạy.");
            return;
        }
        try {
            driver.getTitle();
            Object raw = ((JavascriptExecutor) driver).executeScript("return window.recordedSteps;");
            if (raw instanceof List<?> rawList) {
                for (Object item : rawList) {
                    if (item instanceof Map<?, ?> stepMap) {
                        String cmd = stepMap.get("command") != null ? stepMap.get("command").toString() : "";
                        String tgt = stepMap.get("target") != null ? stepMap.get("target").toString() : "";
                        String val = stepMap.get("value") != null ? stepMap.get("value").toString() : "";
                        recordCommand(cmd, tgt, val);
                    }
                }
            }

            ((JavascriptExecutor) driver).executeScript("window.recordedSteps = [];");
        } catch (WebDriverException e) {
            System.err.println("Phiên trình duyệt không còn hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Lỗi khác khi đồng bộ step từ trình duyệt: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
