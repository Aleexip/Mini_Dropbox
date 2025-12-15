package dropbox.alexandru.panait.controller;

import dropbox.alexandru.panait.model.FileEntity;
import dropbox.alexandru.panait.model.User;
import dropbox.alexandru.panait.repository.UserRepository;
import dropbox.alexandru.panait.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileService fileService;

    // We need the UserRepository to fetch the user by ID
    @Autowired
    private UserRepository userRepository;

    // @RequestParam is used to get data from the query string or form data
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        try {
            // 1. Looking for the user in the database
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            // 2. Store the file using the FileService
            fileService.store(file, user);

            return ResponseEntity.status(HttpStatus.OK)
                    .body("File uploaded successfully: " + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id) {
        try {
            // 1. We get the FileEntity from the database
            FileEntity fileEntity = fileService.getFile(id);

            // 2. Get the path on disk
            Path path = Paths.get(fileEntity.getFilePath());

            // 3. Read the bytes directly from disk
            byte[] data = Files.readAllBytes(path);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileEntity.getType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getName() + "\"")
                    .body(data);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all files for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileEntity>> getAllFiles(@PathVariable Long userId) {
        List<FileEntity> files = fileService.getAllFiles(userId);
        return ResponseEntity.ok(files);
    }

    // Delete a file by its id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {
        try {
            fileService.deleteFile(id);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete file: " + e.getMessage());
        }
    }
}