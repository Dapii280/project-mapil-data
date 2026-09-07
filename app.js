// Konfigurasi Supabase
const SUPABASE_URL = 'https://hhhsgssouqrteavnwmcl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaHNnc3NvdXFydGVhdm53bWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODI5NjYsImV4cCI6MjEwNDM1ODk2Nn0.siao_80m7KC6D68HKea1BAMqce7rsgWbfZlKHSCecIM';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('crud-form');
const itemsList = document.getElementById('items-list');

// 1. READ (Ambil Data)
async function fetchItems() {
  try {
    const { data, error } = await supabaseClient.from('items').select('*').order('id', { ascending: false });
    
    if (error) {
      itemsList.innerHTML = 'Gagal mengambil data: ' + error.message;
      return;
    }
    
    if (!data || data.length === 0) {
      itemsList.innerHTML = '<p>Belum ada data.</p>';
      return;
    }

    itemsList.innerHTML = data.map(item => `
      <div class="item-card">
        <div>
          <strong>${item.title}</strong> <small style="color: #0070f3; font-weight: bold;">[${item.category || 'Umum'}]</small>
          <p style="margin: 4px 0 0; color: #555;">${item.description}</p>
        </div>
        <button class="btn-delete" onclick="deleteItem(${item.id})">Hapus</button>
      </div>
    `).join('');
  } catch (err) {
    itemsList.innerHTML = 'Koneksi terputus/CORS error. Cek koneksi internet atau URL Supabase.';
    console.error(err);
  }
}

// 2. CREATE (Tambah Data)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  const { error } = await supabaseClient.from('items').insert([{ title, category, description }]);
  
  if (error) {
    alert('Gagal menambah data: ' + error.message);
  } else {
    form.reset();
    fetchItems();
  }
});

// 3. DELETE (Hapus Data)
async function deleteItem(id) {
  if (confirm('Yakin mau hapus data ini?')) {
    const { error } = await supabaseClient.from('items').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus: ' + error.message);
    } else {
      fetchItems();
    }
  }
}

// Jalankan saat halaman dibuka
fetchItems();