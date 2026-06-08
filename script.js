const imageInput = document.getElementById("imageInput");
const formatSelect = document.getElementById("formatSelect");
const targetSizeInput = document.getElementById("targetSize");
const sizeUnit = document.getElementById("sizeUnit");
const convertBtn = document.getElementById("convertBtn");
const progressBar = document.getElementById("progressBar");
const downloadLink = document.getElementById("downloadLink");
const statusText = document.getElementById("status");
const dropZone = document.getElementById("dropZone");

let selectedFile = null;

imageInput.addEventListener("change", e => {
    selectedFile = e.target.files[0];
});

dropZone.addEventListener("dragover", e => {
    e.preventDefault();
});

dropZone.addEventListener("drop", e => {
    e.preventDefault();
    selectedFile = e.dataTransfer.files[0];
});

convertBtn.addEventListener("click", async () => {

    if (!selectedFile) {
        alert("Select a file");
        return;
    }

    progressBar.style.width = "10%";
    statusText.innerText = "Reading file...";

    const img = new Image();

    img.src = URL.createObjectURL(selectedFile);

    img.onload = () => {

        progressBar.style.width = "40%";

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const format = formatSelect.value;

        // PDF Conversion
        if (format === "pdf") {

            progressBar.style.width = "70%";
            statusText.innerText = "Creating PDF...";

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF();

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight =
                (img.height * pdfWidth) / img.width;

            pdf.addImage(
                canvas.toDataURL("image/jpeg", 1.0),
                "JPEG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            pdf.save("converted.pdf");

            progressBar.style.width = "100%";
            statusText.innerText =
                "PDF created successfully!";

            return;
        }

        let mime = "image/jpeg";

        if (format === "png")
            mime = "image/png";

        if (format === "webp")
            mime = "image/webp";

        let quality = 0.9;

        const target =
            Number(targetSizeInput.value);

        const unit = sizeUnit.value;

        let targetBytes =
            unit === "MB"
                ? target * 1024 * 1024
                : target * 1024;

        function compress() {

            let data =
                canvas.toDataURL(
                    mime,
                    quality
                );

            let bytes =
                Math.round(
                    (data.length * 3) / 4
                );

            if (
                target > 0 &&
                bytes > targetBytes &&
                quality > 0.1
            ) {

                quality -= 0.05;

                compress();

            } else {

                progressBar.style.width = "100%";

                statusText.innerText =
                    `Approx Size: ${(bytes / 1024).toFixed(1)} KB`;

                downloadLink.href = data;

                downloadLink.download =
                    `converted.${format}`;

                downloadLink.style.display =
                    "block";
            }
        }

        compress();
    };
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
