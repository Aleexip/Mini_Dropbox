package dropbox.alexandru.panait.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    private String filePath;

    private Long size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Prevents circular references during JSON serialization

    private User owner;

    // @Lob tells to the JPA provider that this field should be treated as a Large
    // Object.
    // In Postgres, this is important for binary files
    @Lob
    @Column(name = "data", length = 100000) // We can set a limit, or not
    private byte[] data;

    public FileEntity() {
    }

    // Constructor
    public FileEntity(String name, String type, String filePath, Long size, User owner) {
        this.name = name;
        this.type = type;
        this.filePath = filePath;
        this.size = size;
        this.owner = owner;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
