package dropbox.alexandru.panait.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path storageLocation;

    public FileStorageService() throws IOException {
        storageLocation = Paths.get("./uploaded-files").toAbsolutePath().normalize();
        Files.createDirectories(storageLocation);
    }

    public String storeFile(MultipartFile file) throws IOException {
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains("."))
            ext = original.substring(original.lastIndexOf("."));
        String name = UUID.randomUUID().toString() + ext;
        Path target = storageLocation.resolve(name);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target.toString();
    }

    public Path load(String storedPath) {
        return Paths.get(storedPath);
    }
}
