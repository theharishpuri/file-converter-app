const imageInput = document.getElementById("imageInput");
const formatSelect = document.getElementById("formatSelect");
const convertBtn = document.getElementById("convertBtn");
const downloadLink = document.getElementById("downloadLink");

convertBtn.addEventListener("click", () => {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        const img = new Image();

        img.onload = function() {

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const format = formatSelect.value;

            let mimeType = "image/png";

            if (format === "jpeg") {
                mimeType = "image/jpeg";
            }

            if (format === "webp") {
                mimeType = "image/webp";
            }

            const convertedImage =
                canvas.toDataURL(mimeType, 0.9);

            downloadLink.href = convertedImage;
            downloadLink.download =
                "converted." + format;

            downloadLink.style.display = "block";
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});
