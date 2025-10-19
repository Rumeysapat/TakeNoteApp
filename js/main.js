//ay dizisi
const months = [
  'ocak',
  'subat',
  'mart',
  'nisan',
  'mayis',
  'haziran',
  'temmuz',
  'agustos',
  'eylul',
  'ekim',
  'kasim',
  'aralik',
];

//html de bulunan elementlere js ile ulas
const addBox = document.querySelector('.add-box');
const popupBox = document.querySelector('.popup-box');
const popup = document.querySelector('.popup');
const closeBtn = document.querySelector('header i');
const form = document.querySelector('form');
const wrapper = document.querySelector('.wrapper');
const popupTitle = document.querySelector('#popup-title');
const popupButton = document.querySelector('#form-btn');

const DB_NOTES = 'notes';

//Local storage"da eger veri varse parse at. yoksa bos bir
//note dizisi olustur
let notes = JSON.parse(localStorage.getItem('notes') || []);

let isUpdate = false; // gülleme modunda mı?
let updateId = null; //gullenmek ıstenen elemanın id si

//sayfa yuklendıgı anda renderNotes fonksiyonunu calıştır

document.addEventListener('DOMContentLoaded', renderNotes(notes));

//notlari arayuze render edecek fonksiyon
function renderNotes(notes) {
  //notes dizisi icindeki her eleman icin not note html"i kaldir

  document.querySelectorAll('.note').forEach((noteItem) => noteItem.remove());

  notes.forEach((note) => {
    let noteHTML = `      <div class="note" data-id=${note.id} >

        <div class="details">
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>


        <div class="bottom">

          <p>${note.date}</p>


          <div class="settings">

            <i class="bx bx-dots-horizontal-rounded"></i>


            <ul class="menu">
              <li class="edit-icon"><i class="bx bx-edit"></i> Edit</li>
              <li class="delete-icon">
                <i class="bx bx-trash"></i>
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>`;

    //elimde bir html elementi var ve bunu arayuze ekle

    //insertAdjacentHTML 2 parametre alir. 1. si ne zaman   islem olacaktir. 2. si ise hangi eleman eklenilecek.
    addBox.insertAdjacentHTML('afterend', noteHTML);
  });
}

//addBox a tiklenildiginda
addBox.addEventListener('click', () => {
  // popup alanlarina show classini ekle ve gorunur yap
  popupBox.classList.add('show');
  popup.classList.add('show');

  //popup gorunur oldugunda arka planda yer alan elemanlarin kaydirilmasini engelle
  document.body.style.overflow = 'hidden';
});

//close button a tiklanildiginda. Popuplardaki show siniflarinia kaldir
closeBtn.addEventListener('click', () => {
  //popup box ve icini gorunmez yap
  popupBox.classList.remove('show');
  popup.classList.remove('show');

  //popup pafis oldugunda arka plani varsayilan yap
  document.body.style.overflow = 'auto';
});

form.addEventListener('submit', (e) => {
  //form submit edildiginde ekranin yenilenmesini engelle
  e.preventDefault();

  //formun icindeki yazi yazilabilen alanlara. Formun bize verdigi nesene uzerinden ulasiyorum. Ilk input alani 0 a denk gelir ve bu nesnenin target dizi uzerinden ulasiriz
  const titleInput = e.target[0];
  const descriptionInput = e.target[1];

  //form alanlarının degerlerı
  const title = titleInput.value;
  const description = descriptionInput.value;

  //herhangi bir alan boş ise
  if (!title || !description) {
    alert('alanlar bos olamaz');
    return;
  }

  //su anın tarihini al
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const updateMonth = months[month]; //ayi sayidan yaziya cevir
  const year = date.getFullYear();
  const id = date.getTime(); //benzersiz bir sayi 1970 den bugune gecen milisaniye

  //eger guncellenen bir elemansa
  if (isUpdate) {
    //guncellenmek istenilen id ile note id sini karsilastir ve bu durumda guncellenecek elemanin sirasiniz bul
    const updateIndex = notes.findIndex((note) => note.id == updateId);

    //burayi guncelle
    notes[updateIndex] = {
      title,
      description,
      date: `${updateMonth} ${day},${year}`,
      id,
    };

    //popup guncelle
    popupTitle.textContent = 'Yeni Not';
    popupButton.textContent = 'Ekle';
    isUpdate = false;
    updateId = null;
  } else {
    //bir objedir
    let noteItem = {
      title,
      description,
      date: `${updateMonth} ${day},${year}`,
      id,
    };
    notes.push(noteItem);
  }

  localStorage.setItem(DB_NOTES, JSON.stringify(notes));

  //render et, ekranda goster
  renderNotes(notes);

  form.reset(); //form elamanlarinin icini temizle

  //popup gorurnurluk yok et
  popupBox.classList.remove('show');
  popup.classList.remove('show');

  document.body.style.overflow = 'auto';
});

//ekrani tiklanildiginda
wrapper.addEventListener('click', (e) => {
  //eger bu 3 noktali alan ise onu yakala
  if (e.target.classList.contains('bx-dots-horizontal-rounded')) {
    showMenu(e.target);
  } else if (e.target.classList.contains('delete-icon')) {
    deleteNote(e.target);
  } else if (e.target.classList.contains('edit-icon')) {
    editNote(e.target);
    //notlari guncelle calistir
  }
});

//menuyu goster
function showMenu(item) {
  //ust elemana ulas
  const parentElement = item.parentElement;

  //bir ust elemani goster
  parentElement.classList.add('show');

  document.addEventListener('click', (e) => {
    //eger tıklana i degil veya gelen i değilse
    if (e.target.tagName != 'I' || e.target != item) {
      parentElement.classList.remove('show');
    }
  });
}

//note sil
function deleteNote(item) {
  const response = confirm('silmek istediginiz emin misiniz?');

  if (response) {
    //sil butonunun kapsayicisina eris
    const noteItem = item.closest('.note');

    //note un data-id sine eris
    const noteId = Number(noteItem.dataset.id);

    //note id si ayni olan elamani filtreleme uzerinden
    // ekleme
    notes = notes.filter((note) => note.id != noteId);

    localStorage.setItem(DB_NOTES, JSON.stringify(notes));

    renderNotes(notes);
  }
}

//icerik guncelle
function editNote(item) {
  popup.classList.add('show');
  popupBox.classList.add('show');

  const note = item.closest('.note');

  const noteId = parseInt(note.dataset.id);

  const foundNote = notes.find((note) => note.id == noteId);

  document.body.style.overflow = 'hidden';

  form[0].value = foundNote.title;
  form[1].value = foundNote.description;

  isUpdate = true;
  updateId = noteId;

  popupTitle.textContent = 'Notu Guncelle';
  popupButton.textContent = 'Guncelle';
}
