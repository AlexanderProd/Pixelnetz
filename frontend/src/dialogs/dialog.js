const dialog = ({
  description,
}) => new Promise((resolve) => {
  const container = document.createElement('div');
  container.classList.add('container');

  const form = document.createElement('form');
  form.classList.add('dialog');
  form.onsubmit = (e) => {
    e.preventDefault();
    document.body.removeChild(container);
    resolve();
  };

  const descriptionBox = document.createElement('p');
  descriptionBox.classList.add('description');
  descriptionBox.innerHTML = description;

  const button = document.createElement('button');
  button.innerHTML = 'OK';
  button.type = 'submit';

  form.appendChild(descriptionBox);
  form.appendChild(button);
  container.appendChild(form);
  document.body.appendChild(container);
});

export default dialog;
