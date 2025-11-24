package dropbox.alexandru.panait.services;

import dropbox.alexandru.panait.model.FileEntity;
import dropbox.alexandru.panait.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public FileEntity store(MultipartFile file) throws IOException {
        // take the file name
        String fileName = file.getOriginalFilename();

        // Create our entity
        // file.getBytes() converts the file into a byte array for the database storage
        FileEntity fileEntity = new FileEntity(fileName, file.getContentType(), file.getBytes());

        // Save to DB
        return fileRepository.save(fileEntity);
    }

    public FileEntity getFile(Long id) {
        // Retrieve file by id from DB and return if found, else throw exception
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
    }
}