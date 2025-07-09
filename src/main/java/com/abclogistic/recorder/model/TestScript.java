package com.abclogistic.recorder.model;
import java.util.ArrayList;
import java.util.List;

public class TestScript {
    private List<TestCommand> commands = new ArrayList<>();
    public List<TestCommand> getCommands() {
        return commands;
    }
    public void addCommand(TestCommand command) {
        commands.add(command);
    }
}
