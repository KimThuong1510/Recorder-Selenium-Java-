package com.abclogistic.recorder.controller;

import com.abclogistic.recorder.service.RecorderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

@Controller
public class RecorderController {
    private final RecorderService recorderService;
    private String folderName;

    @Autowired
    public RecorderController(RecorderService recorderService) {
        this.recorderService = recorderService;
    }

    // Hiển thị form nhập tên folder
    @GetMapping("/")
    public String inputFolder() {
        return "name_folder";
    }

    // Nhận tên folder & hiển thị form nhập URL
    @PostMapping("/folder")
    public String receiveFolder(@RequestParam("folder") String folder, Model model) {
        this.folderName = folder;
        model.addAttribute("folder", folder);
        return "name_url";
    }

    // Xử lý khi bấm nút Start Recording
    @PostMapping("/start")
    public String startRecording(@RequestParam("url") String url, Model model) {
        recorderService.startRecording(url);
        model.addAttribute("url", url);
        model.addAttribute("folder", folderName);
        model.addAttribute("commands", recorderService.getCurrentScript().getCommands());
        return "recording";
    }
    @PostMapping("/stop")
    public String stopRecording(Model model) {
        // Kiểm tra xem có đang recording không
        if (!recorderService.isRecording()) {
            model.addAttribute("error", "Không có phiên ghi hình nào đang hoạt động.");
            model.addAttribute("commands", recorderService.getCurrentScript().getCommands());
            return "recording";
        }
        
        // Kiểm tra driver có còn hoạt động không
        if (recorderService.getDriver() == null) {
            model.addAttribute("error", "Bạn đã đóng trình duyệt, không thể lấy lại các thao tác đã ghi nhận.");
            model.addAttribute("commands", recorderService.getCurrentScript().getCommands());
            return "recording";
        }
        
        // Kiểm tra xem driver có còn kết nối được không
        if (!recorderService.isDriverActive()) {
            model.addAttribute("error", "Bạn đã đóng trình duyệt, không thể lấy lại các thao tác đã ghi nhận.");
            model.addAttribute("commands", recorderService.getCurrentScript().getCommands());
            // Reset trạng thái vì driver đã bị đóng thủ công
            recorderService.resetRecordingState();
            return "recording";
        }
        
        try {
            recorderService.syncStepsFromBrowser();
        } catch (Exception e) {
            System.err.println("Không thể đồng bộ trước khi stop: " + e.getMessage());
        }
        recorderService.stopRecording();
        model.addAttribute("commands", recorderService.getCurrentScript().getCommands());
        return "recording";
    }

    @PostMapping("/api/recorder/stop")
    public ResponseEntity<?> stopRecord() {
        recorderService.stopRecording();
        return ResponseEntity.ok().build();
    }

    // Hàm xử lý tên folder

}
