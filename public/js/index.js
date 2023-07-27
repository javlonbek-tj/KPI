
/* Choose user accordingly to department */

function updateUsers() {
  const departmentSelect = document.getElementById('departmentId');
  const userSelect = document.getElementById('fullname');
  const selectedDepartment = departmentSelect.value;

  // Clear the user select options
  userSelect.innerHTML = '';

  // Add the default option for user
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.text = 'Xodimni tanlang';
  defaultOption.setAttribute('disabled', 'disabled');
  defaultOption.setAttribute('selected', 'selected');
  userSelect.appendChild(defaultOption);

  // If no province is selected, return
  if (selectedDepartment === '') {
    return;
  }

  // Make a fetch request to retrieve the users for the selected department
  fetch(`/users?departmentId=${selectedDepartment}`)
    .then(response => response.json())
    .then(data => data.users)
    .then(users => {
      // Create and append option elements for each user
      for (let i = 0; i < users.length; i++) {
        const option = document.createElement('option');
        option.value = users[i].fullname;
        option.text = users[i].fullname;
        userSelect.appendChild(option);
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

/* File upload */

// Iterate over each file input and attach event listeners
document.querySelectorAll('[id^="file-"]').forEach(function (fileInput) {
  fileInput.addEventListener('change', function (e) {
    if (e.target.files.length == 0) {
      return;
    }
    var index = fileInput.id.split('-')[1];
    document.querySelector('#file-' + index + '-preview').classList.add('d-none');
    document.querySelector('#file-' + index + '-uploaded').classList.remove('d-none');
  });
});

/* User photo upload */

const userImg = document.querySelector('#userPhoto');
userImg?.addEventListener('change', function (e) {
  if (e.target.files.length == 0) {
    return;
  }
  let file = e.target.files[0];
  let url = URL.createObjectURL(file);
  let previewImg = document.querySelector('#userPhoto-preview img');
  previewImg.src = url;
  previewImg.style.width = '70px';
  previewImg.style.height = '70px';
  previewImg.style.cursor = 'pointer';
  previewImg.style.borderRadius = '50%';
  document.querySelector('#userPhoto-preview + p').style.display = 'none';
});
