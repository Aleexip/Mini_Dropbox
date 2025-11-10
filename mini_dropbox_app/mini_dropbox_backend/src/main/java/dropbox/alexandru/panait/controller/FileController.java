package dropbox.alexandru.panait.controller;

import dropbox.alexandru.panait.model.FileMetadata;
import dropbox.alexandru.panait.repository.FileMetadataRepository;
import dropbox.alexandru.panait.services.FileStorageService;
import org.springframework.core.io.PathResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000") // Allow all origins for simplicity
public class FileController {

    private final FileStorageService storage;
    private final FileMetadataRepository repo;

    public FileController(FileStorageService storage, FileMetadataRepository repo) {
        this.storage = storage;
        this.repo = repo;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> upload(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "owner", required = false) String owner) throws IOException {
        String path = storage.storeFile(file);
        FileMetadata meta = new FileMetadata();
        meta.setFilename(file.getOriginalFilename());
        meta.setContentType(file.getContentType());
        meta.setSize(file.getSize());
        meta.setPath(path);
        meta.setOwner(owner == null ? "anonymous" : owner);
        meta.setUploadedAt(Instant.now());
        FileMetadata saved = repo.save(meta);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<FileMetadata> list(@RequestParam(value = "owner", required = false) String owner) {
        if (owner != null)
            return repo.findByOwner(owner);
        return repo.findAll();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<PathResource> download(@PathVariable Long id) {
        FileMetadata meta = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        PathResource resource = new PathResource(storage.load(meta.getPath()));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        meta.getContentType() == null ? "application/octet-stream" : meta.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getFilename() + "\"")
                .body(resource);
    }
}
