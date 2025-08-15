const firebaseConfig = {
  apiKey: "AIzaSyAtoOl7HrYpdZQqZsHzrJn4Urcfp4IDLko",
  authDomain: "onlinesystem-72eb5.firebaseapp.com",
  projectId: "onlinesystem-72eb5",
  storageBucket: "onlinesystem-72eb5.firebasestorage.app",
  messagingSenderId: "436376296755",
  appId: "1:436376296755:web:c05f266d69935062b9f246",
  measurementId: "G-NES6GHH2ZX"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const productsCollection = db.collection('products');

const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const logoutButton = document.getElementById('logoutButton');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

auth.onAuthStateChanged(user => {
    if (user) {
        loadProducts();
    } else {
        window.location.href = 'index.html';
    }
});

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productName = document.getElementById('productName').value;
    const productPrice = Number(document.getElementById('productPrice').value);
    const employeeCommission = Number(document.getElementById('employeeCommission').value);
    try {
        await productsCollection.add({
            name: productName,
            price: productPrice,
            commission: employeeCommission,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        productForm.reset();
        productModal.hide();
        alert('کاڵاکە بە سەرکەوتوویی زیادکرا!');
    } catch (error) {
        alert('هەڵەیەک ڕوویدا لە کاتی زیادکردنی کاڵا!');
    }
});

const loadProducts = () => {
    productsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">...چاوەڕوانی داتاکان</td></tr>';
    productsCollection.orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        if (snapshot.empty) {
            productsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">هیچ کاڵایەک تۆمار نەکراوە.</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const product = doc.data();
            html += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.price.toLocaleString()} دینار</td>
                    <td>${product.commission.toLocaleString()} دینار</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${doc.id}')">
                            <i class="bi bi-trash-fill"></i> سڕینەوە
                        </button>
                    </td>
                </tr>`;
        });
        productsTableBody.innerHTML = html;
    }, error => {
        productsTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">هەڵەیەک لە بارکردنی داتاکان ڕوویدا.</td></tr>';
    });
};

window.deleteProduct = async (id) => {
    if (confirm('دڵنیایت لە سڕینەوەی ئەم کاڵایە؟')) {
        try {
            await productsCollection.doc(id).delete();
            alert('کاڵاکە بە سەرکەوتوویی سڕایەوە.');
        } catch (error) {
            alert('هەڵەیەک ڕوویدا!');
        }
    }
};

logoutButton.addEventListener('click', () => {
    auth.signOut();
});
