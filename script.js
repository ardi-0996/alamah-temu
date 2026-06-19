// ============================================
// script.js — Complete JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // ===== 1. MOBILE NAV TOGGLE =====
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
    });
  }

  // ===== 2. ACTIVE LINK HIGHLIGHTING =====
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function(a) {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ===== 3. CONTACT FORM (Halaman Kontak) =====
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nama = document.querySelector('[name="nama"]')?.value || '';
      const produk = document.querySelector('[name="produk"]')?.value || '';
      const pesan = document.querySelector('[name="pesan"]')?.value || '';

      const msg = 'Halo ALAMAH TEMU,%0A%0A' +
                  '*Permintaan dari:* ' + nama + '%0A' +
                  '*Produk yang Diminati:* ' + produk + '%0A' +
                  '*Pesan:* ' + pesan + '%0A%0A' +
                  '-- Dikirim dari form website --';

      window.open('https://wa.me/6289636868098?text=' + msg, '_blank');
    });
  }

  // ===== 4. BELI PAGE — PRODUCT ORDER =====
  const productItems = document.querySelectorAll('.product-item');
  const ringkasanItems = document.getElementById('ringkasan-items');
  const totalHargaEl = document.getElementById('total-harga');
  const orderForm = document.getElementById('order-form');

  // Cek apakah di halaman Beli
  if (productItems.length > 0 && ringkasanItems && totalHargaEl) {

    // Data pesanan
    var order = {};

    // Fungsi format Rupiah
    function formatRupiah(angka) {
      return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Update Ringkasan
    function updateRingkasan() {
      var items = Object.values(order).filter(function(item) { return item.qty > 0; });
      var total = 0;

      if (items.length === 0) {
        ringkasanItems.innerHTML = '<p class="empty-ringkasan">Belum ada produk dipilih.</p>';
        totalHargaEl.textContent = 'Rp 0';
        return;
      }

      var html = '';
      items.forEach(function(item) {
        var subtotal = item.price * item.qty;
        total += subtotal;
        html += '<div class="ringkasan-item">' +
                '  <div class="item-info">' +
                '    <div class="item-name">' + item.name + '</div>' +
                '    <div class="item-detail">' + formatRupiah(item.price) + ' / kg × ' + item.qty + '</div>' +
                '  </div>' +
                '  <div class="item-total">' + formatRupiah(subtotal) + '</div>' +
                '</div>';
      });

      ringkasanItems.innerHTML = html;
      totalHargaEl.textContent = formatRupiah(total);
    }

    // Update Product Item
    function updateProductItem(productId) {
      var item = order[productId];
      var productEl = document.querySelector('.product-item[data-product="' + productId + '"]');
      if (!productEl) return;

      var qtySpan = productEl.querySelector('.qty-value');
      qtySpan.textContent = item ? item.qty : 0;

      if (item && item.qty > 0) {
        productEl.classList.add('active');
      } else {
        productEl.classList.remove('active');
      }

      updateRingkasan();
    }

    // Inisialisasi Produk
    productItems.forEach(function(el) {
      var productId = el.dataset.product;
      var price = parseInt(el.dataset.price);
      var name = el.dataset.name;

      order[productId] = {
        name: name,
        price: price,
        qty: 0
      };

      // Event: Tombol +
      var plusBtn = el.querySelector('.qty-plus');
      plusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        order[productId].qty += 1;
        updateProductItem(productId);
      });

      // Event: Tombol -
      var minusBtn = el.querySelector('.qty-minus');
      minusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (order[productId].qty > 0) {
          order[productId].qty -= 1;
          updateProductItem(productId);
        }
      });

      // Klik pada item untuk menambah
      el.addEventListener('click', function() {
        order[productId].qty += 1;
        updateProductItem(productId);
      });
    });

    // Form Submit ke WhatsApp
    if (orderForm) {
      orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nama = document.getElementById('nama').value.trim();
        var whatsapp = document.getElementById('whatsapp').value.trim();
        var alamat = document.getElementById('alamat').value.trim();

        if (!nama || !whatsapp || !alamat) {
          alert('Harap isi semua data pengiriman.');
          return;
        }

        var items = Object.values(order).filter(function(item) { return item.qty > 0; });
        if (items.length === 0) {
          alert('Harap pilih minimal 1 produk.');
          return;
        }

        var pesan = 'Halo ALAMAH TEMU,%0A%0A';
        pesan += '*PESANAN BARU*%0A%0A';
        pesan += '*Data Pengirim:*%0A';
        pesan += 'Nama: ' + nama + '%0A';
        pesan += 'WhatsApp: ' + whatsapp + '%0A';
        pesan += 'Alamat: ' + alamat + '%0A%0A';
        pesan += '*Pesanan:*%0A';

        var total = 0;
        items.forEach(function(item) {
          var subtotal = item.price * item.qty;
          total += subtotal;
          pesan += '- ' + item.name + ' × ' + item.qty + ' kg = ' + formatRupiah(subtotal) + '%0A';
        });

        pesan += '%0A*Total: ' + formatRupiah(total) + '*%0A';
        pesan += '%0AOngkir: Dihitung saat konfirmasi%0A';
        pesan += '%0A-- Dikirim dari website ALAMAH KOPI --';

        window.open('https://wa.me/6289636868098?text=' + pesan, '_blank');
      });
    }
  }

  // ===== 5. FOOTER YEAR =====
  var yrEl = document.getElementById('yr');
  if (yrEl) {
    yrEl.textContent = new Date().getFullYear();
  }

});