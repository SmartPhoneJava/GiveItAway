import { fail, failEasy } from '../requests';

let KEY = 0;

export function NEWhandleFiles(file, addPhoto, index, v) {
	var dataurl = null;
	var canvas = document.createElement('canvas');

	// Create a file reader
	var reader = new FileReader();
	// Set the image once loaded into file reader
	reader.onload = function (e) {
		let img = new Image();
		img.src = e.target.result;

		console.log('we wanna start');
		img.onerror = function () {
			console.log('we wanna abort');
			failEasy('Изображение поломано, загрузка не удалась');
			KEY++;
			v(index);
		};
		img.onload = function () {
			console.log('we wanna end');
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);

			var MAX_WIDTH = 800;
			var MAX_HEIGHT = 600;
			var width = img.width;
			var height = img.height;

			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}

			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, width, height);

			dataurl = canvas.toDataURL(file.type);

			var blobBin = atob(dataurl.split(',')[1]);
			var array = [];
			for (var i = 0; i < blobBin.length; i++) {
				array.push(blobBin.charCodeAt(i));
			}
			var blob = new Blob([new Uint8Array(array)], { type: file.type });
			let newFile = new File([blob], file.name, { type: file.type });
			KEY++;
			console.log('setLoading wanna', index);
			v(index);
			addPhoto({ src: dataurl, id: KEY, origin: newFile });
		};
	};
	// Load files into file reader
	reader.readAsDataURL(file);
}

function detectVerticalSquash(img) {
	var iw = img.naturalWidth,
		ih = img.naturalHeight;
	var canvas = document.createElement('canvas');
	canvas.width = 1;
	canvas.height = ih;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	var data = ctx.getImageData(0, 0, 1, ih).data;
	// search image edge pixel position in case it is squashed vertically.
	var sy = 0;
	var ey = ih;
	var py = ih;
	while (py > sy) {
		var alpha = data[(py - 1) * 4 + 3];
		if (alpha === 0) {
			ey = py;
		} else {
			sy = py;
		}
		py = (ey + sy) >> 1;
	}
	var ratio = py / ih;
	return ratio === 0 ? 1 : ratio;
}

/**
 * A replacement for context.drawImage
 * (args are for source and destination).
 */
function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
	var vertSquashRatio = detectVerticalSquash(img);
	// Works only if whole image is displayed:
	// ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
	// The following works correct also when only a part of the image is displayed:
	ctx.drawImage(
		img,
		sx * vertSquashRatio,
		sy * vertSquashRatio,
		sw * vertSquashRatio,
		sh * vertSquashRatio,
		dx,
		dy,
		dw,
		dh
	);
}

export const MAX_FILE_SIZE = 1024 * 1024 * 4;

function checkFileSize(file) {
	return file.size <= MAX_FILE_SIZE;
}

function checkFileType(file) {
	return file.type.match('image.*');
}

export const loadPhotos = async (e, handleWrongSize, handleWrongType, loaded, addPhoto, end) => {
	var files = e.target.files; // FileList object

	if (files.length == 0 || loaded == 3) {
		console.log('end is here');
		end();
		return;
	}
	let flen = files.length;
	if (flen > 3) {
		flen = 3;
	}

	var done = loaded;
	console.log('files.length', flen, loaded);
	for (var i = 0, file; (file = files[i]); i++) {
		if (i + loaded > 2) {
			break;
		}
		console.log('we start 1');
		if (!file) {
			continue;
		}
		console.log('we start 2');
		if (!checkFileSize(file)) {
			handleWrongSize(file);
			end();
			continue;
		}
		console.log('we start 3');
		if (!checkFileType(file)) {
			handleWrongType(file);
			end();
			continue;
		}
		NEWhandleFiles(file, addPhoto, i, (i) => {
			done++;
			console.log('loooook', i, flen - loaded - 1);
			if (loaded + flen > 3 ? done == 3 : i == flen - 1) {
				console.log('eeeeend');
				end();
			}
		});
	}
};
