/**
 * CS 246 Lab 8 - Example Java Solution
 * This file demonstrates how to read and process the lab data files.
 */

import java.io.*;
import java.util.*;
import org.json.simple.*;
import org.json.simple.parser.*;

public class JavaExample {
    
    /**
     * Read student data from CSV file
     */
    public static List<Map<String, String>> readStudentsCSV(String filename) throws IOException {
        List<Map<String, String>> students = new ArrayList<>();
        
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String headerLine = br.readLine();
            String[] headers = headerLine.split(",");
            
            String line;
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                Map<String, String> student = new HashMap<>();
                for (int i = 0; i < headers.length && i < values.length; i++) {
                    student.put(headers[i], values[i]);
                }
                students.add(student);
            }
        }
        return students;
    }
    
    /**
     * Read course data from JSON file
     */
    public static JSONObject readCoursesJSON(String filename) throws Exception {
        JSONParser parser = new JSONParser();
        try (FileReader reader = new FileReader(filename)) {
            JSONObject jsonObject = (JSONObject) parser.parse(reader);
            return jsonObject;
        }
    }
    
    /**
     * Read and analyze text file
     */
    public static Map<String, Integer> analyzeTextFile(String filename) throws IOException {
        StringBuilder content = new StringBuilder();
        int lineCount = 0;
        
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = br.readLine()) != null) {
                content.append(line).append("\n");
                lineCount++;
            }
        }
        
        String text = content.toString().trim();
        String[] words = text.isEmpty() ? new String[0] : text.split("\\s+");
        
        Map<String, Integer> stats = new HashMap<>();
        stats.put("lines", lineCount);
        stats.put("words", words.length);
        stats.put("characters", content.length());
        
        return stats;
    }
    
    /**
     * Main method to demonstrate data processing
     */
    public static void main(String[] args) {
        System.out.println("CS 246 Lab 8 - Data Processing Example\n");
        
        try {
            // Task 1: Read students
            System.out.println("Task 1: Reading students.csv");
            List<Map<String, String>> students = readStudentsCSV("data/students.csv");
            System.out.println("  Found " + students.size() + " students");
            System.out.println("  First student: " + students.get(0).get("first_name") + 
                             " " + students.get(0).get("last_name") + "\n");
            
            // Task 2: Read courses
            System.out.println("Task 2: Reading courses.json");
            JSONObject coursesData = readCoursesJSON("data/courses.json");
            JSONArray courses = (JSONArray) coursesData.get("courses");
            System.out.println("  Found " + courses.size() + " courses\n");
            
            // Task 4: Analyze text file
            System.out.println("Task 4: Analyzing sample.txt");
            Map<String, Integer> stats = analyzeTextFile("data/sample.txt");
            System.out.println("  Lines: " + stats.get("lines"));
            System.out.println("  Words: " + stats.get("words"));
            System.out.println("  Characters: " + stats.get("characters"));
            
        } catch (Exception e) {
            System.err.println("Error processing files: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
