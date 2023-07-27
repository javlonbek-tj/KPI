import fs from 'fs';


export function deleteFile(filePath) {
  fs.unlink(filePath, err => {
    if (err) {
      throw err;
    }
  });
}

function deleteFiles(files) {
  let i = files.length;
  files.forEach(filepath => {
    fs.unlink(filepath, err => {
      i--;
      if (err) {
        throw err;
      } else if (i <= 0) {
        return;
      }
    });
  });
}


export function getImageUrl(images) {
  const imageUrl = [];
  let userPhoto;
  let resume;
  if (images.userPhoto) {
    userPhoto = images.userPhoto[0].path;
    imageUrl.push(userPhoto);
  }
  if (images.resume) {
    resume = images.resume[0].path;
    imageUrl.push(resume);
  }
  return imageUrl;
}

export function deleteImages(images) {
  const imageUrl = getImageUrl(images);
  if (imageUrl.length >= 2) {
    deleteFiles(imageUrl);
  } else {
    deleteFile(imageUrl[0]);
  }
}