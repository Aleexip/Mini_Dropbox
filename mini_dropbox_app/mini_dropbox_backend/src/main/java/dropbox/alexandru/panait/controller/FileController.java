package dropbox.alexandru.panait.controller;

import dropbox.alexandru.panait.model.FileEntity;
import dropbox.alexandru.panait.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/files") // all file-related endpoints will start with /api/files
@CrossOrigin(origins = "*") // Allows connection from any frontend (local HTML/JS)
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            fileService.store(file);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("File uploaded successfully: " + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id) {
        FileEntity fileEntity = fileService.getFile(id);

        return ResponseEntity.ok()
                // we set the content type to the one stored in the DB
                .contentType(MediaType.parseMediaType(fileEntity.getType()))
                // This header forces the browser to open the "Save As" window
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getName() + "\"")
                // The response body is exactly the byte array from the database
                .body(fileEntity.getData());
    }
}
