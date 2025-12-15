package dropbox.alexandru.panait.services;

import dropbox.alexandru.panait.model.FileEntity;
import dropbox.alexandru.panait.model.User;
import dropbox.alexandru.panait.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.List;

@Service
public class FileService {

    // Define the folder where files will be stored
    private final Path fileStorageLocation;

    @Autowired
    private FileRepository fileRepository;

    public FileService() {
        // Path to the folder from the root of the project
        this.fileStorageLocation = Paths.get("uploaded-files").toAbsolutePath().normalize();

        try {
            // If the folder does not exist, create it
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Nu s-a putut crea folderul pentru upload.", ex);
        }
    }

    // New method to get all files for a specific user
    public List<FileEntity> getAllFiles(Long userId) {
        return fileRepository.findByOwnerId(userId);
    }

    public FileEntity store(MultipartFile file, User owner) throws IOException {

        // 1. Clean the file name
        String originalFileName = file.getOriginalFilename();

        // 2. Generate a unique name on disk (so it doesn't get overwritten if two users
        // upload "poza.jpg")
        // Ex: "vacanta.jpg" becomes "a1b2c3d4-vacanta.jpg"
        String fileNameOnDisk = UUID.randomUUID().toString() + "_" + originalFileName;

        // 3. Resolve the full path where the file will be stored

        Path targetLocation = this.fileStorageLocation.resolve(fileNameOnDisk);

        // 4. Copy the actual bytes to the file on disk
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // 5. Create the entity for the database (Here we use the new constructor!)
        // We save only the relative path or the file name on disk
        FileEntity fileEntity = new FileEntity(
                originalFileName, // Original name (for display)
                file.getContentType(), // Type (pdf, jpg)
                targetLocation.toString(), // Physical path where we put it
                file.getSize(), // Size
                owner // Owner
        );

        // 6. Save the metadata in the DB
        return fileRepository.save(fileEntity);
    }

    public FileEntity getFile(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
    }
}