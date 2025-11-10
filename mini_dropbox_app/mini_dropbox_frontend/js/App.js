document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("fileInput");
    const owner = document.getElementById("owner").value;
    if (!input.files || input.files.length === 0) {
      alert("Select a file to upload.");
      return;
    }
    const file = input.files[0];
    const fd = new FormData();
    fd.append("file", file);
    if (owner) fd.append("owner", owner);

    const status = document.getElementById("status");
    status.textContent = "Uploading...";

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed: " + res.statusText);
      const data = await res.json();
      status.textContent = `Upload OK: ${data.filename}`;
    } catch (err) {
      console.error(err);
      status.textContent = "Upload error: " + err.message;
    }
  });
});
