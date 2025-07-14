package com.abclogistic.recorder.model;

public class TestCommand {
    private String command;
    private String target;
    private String value;

    public TestCommand(String command, String target, String value) {
        this.command = command;
        this.target = target;
        this.value = value;
    }

    public String getCommand() { return command; }
    public void setCommand(String command) { this.command = command; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
