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

const userNameSpan = document.getElementById('userName');
const userRoleSpan = document.getElementById('userRole');
const dashboardContent = document.getElementById('dashboard-content');
const loader = document.getElementById('loader');
const logoutButton = document.getElementById('logoutButton');
const mainContainer = document.querySelector('.container');

const unsubscribe = auth.onAuthStateChanged(async (user) => {
    unsubscribe();
    if (user) {
        await loadUserDataAndDashboard(user);
    } else {
        window.location.replace('index.html');
    }
});

async function loadUserDataAndDashboard(user) {
    try {
        const userDocRef = db.collection('users').doc(user.uid);
        const doc = await userDocRef.get();
        if (doc.exists) {
            const userData = doc.data();
            const name = userData.name || 'بەکارهێنەری بەڕێز';
            const role = userData.role || 'employee';
            userNameSpan.textContent = name;
            userRoleSpan.textContent = role === 'admin' ? 'بەڕێوەبەر' : 'کارمەند';
            loadDashboardByRole(role);
            mainContainer.style.display = 'block';
            loader.style.display = 'none';
        } else {
            alert("هەڵە: داتای بەکارهێنەر نەدۆزرایەوە. تۆ logout دەکرێیت.");
            auth.signOut();
        }
    } catch (error) {
        alert("هەڵەیەکی گەورە ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.");
        auth.signOut();
    }
}

function loadDashboardByRole(role) {
    if (role === 'admin') {
        dashboardContent.innerHTML = `
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card text-center h-100"><div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">بەڕێوەبردنی کاڵاکان</h5>
                        <p class="card-text">لێرەوە کاڵای نوێ زیاد بکە و نرخەکان دیاری بکە.</p>
                        <a href="products.html" class="btn btn-primary mt-auto">بڕۆ بۆ بەشی کاڵاکان</a>
                    </div></div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card text-center h-100"><div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">لیستی فرۆشراوەکان</h5>
                        <p class="card-text">سەیرکردنی ڕاپۆرتی فرۆشی هەموو کارمەندەکان.</p>
                        <a href="#" class="btn btn-secondary mt-auto disabled">بینینی ڕاپۆرتەکان (بەم زووانە)</a>
                    </div></div>
                </div>
            </div>`;
    } else {
        dashboardContent.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card text-center h-100"><div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">تۆماری فرۆشتن</h5>
                        <p class="card-text">لێرەوە ئەو کاڵایانەی ئەمڕۆ فرۆشتووتە تۆماری بکە.</p>
                        <a href="#" class="btn btn-success mt-auto disabled">تۆماری فرۆشتنی نوێ (بەم زووانە)</a>
                    </div></div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card text-center h-100"><div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">مووچەکەم</h5>
                        <p class="card-text">بینینی مووچەی ڕۆژانە و مانگانەت.</p>
                        <a href="#" class="btn btn-info text-white mt-auto disabled">بینینی مووچەکەم (بەم زووانە)</a>
                    </div></div>
                </div>
            </div>`;
    }
}

logoutButton.addEventListener('click', () => {
    auth.signOut();
});
