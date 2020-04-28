let KEY = 0;

function handleFileSelect(f, addPhoto) {
	var reader = new FileReader();
	// Closure to capture the file information.
	reader.onload = (function (theFile) {
		return function (e) {
			KEY++;
			addPhoto({ src: e.target.result, id: KEY, origin: theFile })
		};
	})(f);
	// Read in the image file as a data URL.
	reader.readAsDataURL(f);
}

export const MAX_FILE_SIZE = 1024 * 1024 * 4;

function checkFileSize(file) {
	return file.size <= MAX_FILE_SIZE;
}

function checkFileType(file) {
	return file.type.match('image.*');
}

export const loadPhotos = (e, handleWrongSize, handleWrongType, addPhoto, end) => {
	var files = e.target.files; // FileList object
	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, file; (file = files[i]); i++) {
		if (!file) {
			continue;
		}
		if (!checkFileSize(file)) {
			handleWrongSize(file)
			continue;
		}
		if (!checkFileType(file)) {
			handleWrongType(file)
			continue;
		}
		handleFileSelect(file, addPhoto);
    }
    end()
};
