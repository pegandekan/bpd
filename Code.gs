/** SIP-BPD Desa Pegandekan | Rebuild 1.0 | Google Sheets + Apps Script */
const APP = Object.freeze({TITLE:'SIP-BPD Desa Pegandekan', TZ:'Asia/Jakarta', SESSION_TTL:21600, SPREADSHEET_KEY:'SIP_BPD_SPREADSHEET_ID'});
const ROLES = ['Admin BPD','Ketua BPD','Anggota BPD','Pemerintah Desa','Masyarakat'];
const CORE = {
  Pengaturan:['Key','Value'],
  Pengguna:['ID','Nama','Username','PasswordHash','Salt','Role','Aktif','DibuatPada'],
  Aspirasi:['ID','Tanggal','Nama','Kontak','Kategori','IsiAspirasi','Status','TindakLanjut','DibuatOleh','DibuatPada'],
  Rapat:['ID','Tanggal','Jenis','Agenda','Tempat','Pimpinan','Peserta','Hasil','Status','DibuatOleh','DibuatPada'],
  TindakLanjut:['ID','Tanggal','Sumber','Uraian','PenanggungJawab','TargetSelesai','Status','Catatan','DibuatOleh','DibuatPada'],
  Pengawasan:['ID','Tanggal','Bidang','ObjekPengawasan','Temuan','Rekomendasi','TanggapanPemdes','Status','DibuatOleh','DibuatPada'],
  Dokumen:['ID','Tanggal','Kategori','NomorDokumen','Judul','URL','Keterangan','DibuatOleh','DibuatPada'],
  AuditLog:['Waktu','UserID','Nama','Aksi','Modul','RecordID','Detail']
};
const BOOKS = {
  Buku1:{title:'Buku Agenda Surat Keluar',fields:[['Tanggal Catat','date'],['Nomor Surat','text'],['Tanggal Surat','date'],['Hal / Isi Singkat','textarea'],['Tujuan','text'],['Keterangan','text']]},
  Buku2:{title:'Buku Agenda Surat Masuk',fields:[['Tanggal Catat','date'],['Nomor Surat','text'],['Tanggal Surat','date'],['Asal / Pengirim','text'],['Hal / Isi Singkat','textarea'],['Keterangan','text']]},
  Buku3:{title:'Buku Ekspedisi',fields:[['Tanggal Pengiriman','date'],['Tanggal & Nomor Surat','text'],['Hal / Isi Singkat Surat','textarea'],['Tujuan Surat','text'],['Keterangan','text']]},
  Buku4:{title:'Buku Data Inventaris BPD',fields:[['Jenis Barang/Bangunan','text'],['Asal: APBDesa','text'],['Bantuan Pemerintah','text'],['Bantuan Provinsi','text'],['Bantuan Kab/Kota','text'],['Awal Tahun: Baik','number'],['Awal Tahun: Rusak','number'],['Penghapusan: Rusak','text'],['Penghapusan: Dijual','text'],['Penghapusan: Disumbangkan','text'],['Tanggal Penghapusan','date'],['Akhir Tahun: Baik','number'],['Akhir Tahun: Rusak','number'],['Keterangan','text']]},
  Buku5:{title:'Buku Laporan Keuangan',fields:[['Tanggal','date'],['Uraian','text'],['Penerimaan (Rp)','number'],['Pengeluaran (Rp)','number']]},
  Buku6:{title:'Buku Tamu BPD',fields:[['Tanggal','date'],['Nama','text'],['Jabatan','text'],['Alamat','text'],['Keperluan','text']]},
  Buku7:{title:'Buku Data Anggota BPD',fields:[['Nama Lengkap','text'],['NIP','text'],['Jenis Kelamin','select',['Laki-laki','Perempuan']],['Tempat, Tanggal Lahir','text'],['Agama','text'],['Jabatan','text'],['Pendidikan Terakhir','text'],['No. & Tgl. SK Pengangkatan','text'],['No. & Tgl. SK Pemberhentian','text'],['Keterangan','text']]},
  Buku8:{title:'Buku Data Kegiatan BPD',fields:[['Hari/Tanggal','date'],['Jenis Kegiatan','text'],['Pelaksana','text'],['Agenda dan Hasil Kegiatan','textarea'],['Keterangan','text']]},
  Buku9:{title:'Buku Data Aspirasi Masyarakat',fields:[['Hari/Tanggal','date'],['Nama/Lembaga Penyampai','text'],['Aspirasi yang Disampaikan','textarea'],['Tindak Lanjut','textarea']]},
  Buku10:{title:'Buku Daftar Hadir Rapat BPD',fields:[['Nama','text'],['Jabatan','text'],['Status Tanda Tangan','select',['Hadir','Tidak Hadir']],['Keterangan','text']]},
  Buku11:{title:'Buku Notulen Rapat BPD',fields:[['Hari/Tanggal','date'],['Materi Rapat','text'],['Peserta','text'],['Ringkasan Pembahasan','textarea']]},
  Buku12:{title:'Buku Data Peraturan/Keputusan BPD',fields:[['Nomor, Tanggal Peraturan/Keputusan','text'],['Tentang','text'],['Uraian Singkat','textarea'],['Keterangan','text']]},
  Buku13:{title:'Buku Data Peraturan Desa',fields:[['Nomor & Tgl. Peraturan Desa','text'],['Tentang','text'],['Uraian Singkat','textarea'],['Nomor & Tgl. Kesepakatan','text'],['Keterangan','text']]},
  Buku14:{title:'Buku Keputusan Musyawarah Desa',fields:[['Hari/Tanggal','date'],['Tentang/Hal Strategis','text'],['Pokok-Pokok Keputusan','textarea'],['Keterangan','text']]},
  Buku15:{title:'Buku Keputusan Perencanaan Pembangunan Desa',fields:[['Hari/Tanggal','date'],['Pokok-Pokok Usulan/Kegiatan','textarea'],['Keterangan','text']]}
};
const MODULE_FIELDS = {
  Aspirasi:[['Tanggal','date'],['Nama','text'],['Kontak','text'],['Kategori','text'],['IsiAspirasi','textarea'],['Status','select',['Diterima','Diverifikasi','Diproses','Selesai']],['TindakLanjut','textarea']],
  Rapat:[['Tanggal','date'],['Jenis','text'],['Agenda','textarea'],['Tempat','text'],['Pimpinan','text'],['Peserta','textarea'],['Hasil','textarea'],['Status','text']],
  TindakLanjut:[['Tanggal','date'],['Sumber','text'],['Uraian','textarea'],['PenanggungJawab','text'],['TargetSelesai','date'],['Status','select',['Belum Diproses','Dalam Proses','Selesai','Tertunda']],['Catatan','textarea']],
  Pengawasan:[['Tanggal','date'],['Bidang','text'],['ObjekPengawasan','text'],['Temuan','textarea'],['Rekomendasi','textarea'],['TanggapanPemdes','textarea'],['Status','text']],
  Dokumen:[['Tanggal','date'],['Kategori','text'],['NomorDokumen','text'],['Judul','text'],['URL','url'],['Keterangan','textarea']]
};
function doGet(){return HtmlService.createTemplateFromFile('Index').evaluate().setTitle(APP.TITLE).addMetaTag('viewport','width=device-width, initial-scale=1');}
function include(file){return HtmlService.createHtmlOutputFromFile(file).getContent();}
function setupSystem(){
  const ss=SpreadsheetApp.getActiveSpreadsheet(); if(!ss) throw new Error('Buka Apps Script dari Google Sheets baru melalui Extensions > Apps Script.');
  const defs=Object.assign({},CORE); Object.keys(BOOKS).forEach(k=>defs[k]=['ID'].concat(BOOKS[k].fields.map(f=>f[0])));
  Object.keys(defs).forEach(name=>ensureSheet_(ss,name,defs[name]));
  const sh=ss.getSheetByName('Pengaturan'); const keys=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat():[];
  [['desa','Desa Pegandekan'],['kecamatan',''],['kabupaten','Purbalingga'],['provinsi','Jawa Tengah'],['nama_aplikasi',APP.TITLE],['kode_surat','BPD']].forEach(r=>{if(!keys.includes(r[0]))sh.appendRow(r);});
  PropertiesService.getScriptProperties().setProperty(APP.SPREADSHEET_KEY,ss.getId());
  return 'Setup selesai. '+Object.keys(defs).length+' sheet tersedia. Data lama tidak dihapus.';
}
function ensureSheet_(ss,name,headers){let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);if(sh.getLastRow()===0){sh.getRange(1,1,1,headers.length).setValues([headers]);}else{const actual=sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getDisplayValues()[0];if(actual.slice(0,headers.length).join('\u001f')!==headers.join('\u001f'))throw new Error('Header sheet '+name+' tidak sesuai. Hentikan setup dan periksa struktur sheet.');}sh.setFrozenRows(1);return sh;}
function createInitialAdminWizard(){const ui=SpreadsheetApp.getUi();const n=ui.prompt('Admin SIP-BPD','Nama lengkap admin:',ui.ButtonSet.OK_CANCEL);if(n.getSelectedButton()!==ui.Button.OK)return 'Dibatalkan.';const p=ui.prompt('Password Admin','Password minimal 12 karakter:',ui.ButtonSet.OK_CANCEL);if(p.getSelectedButton()!==ui.Button.OK)return 'Dibatalkan.';const msg=createInitialAdmin(n.getResponseText(),p.getResponseText());ui.alert(msg+' Username: admin');return msg;}
function createInitialAdmin(name,password){name=clean_(name,120);password=String(password||'');if(!name||password.length<12)throw new Error('Nama wajib diisi dan password minimal 12 karakter.');const sh=sheet_('Pengguna');if(sh.getLastRow()>1)throw new Error('Akun pengguna sudah ada.');const salt=Utilities.getUuid()+Utilities.getUuid(),id=Utilities.getUuid();sh.appendRow([id,name,'admin',passwordHash_(password,salt),salt,'Admin BPD',true,new Date()]);audit_({id:id,nama:name},'CREATE','Pengguna',id,'Admin awal dibuat');return 'Admin awal berhasil dibuat.';}
function login(username,password){username=clean_(username,80).toLowerCase();password=String(password||'');if(!username||!password)throw new Error('Username dan password wajib diisi.');const rows=sheet_('Pengguna').getDataRange().getValues();for(let i=1;i<rows.length;i++){const r=rows[i];if(String(r[2]).toLowerCase()!==username)continue;if(!(r[6]===true||String(r[6]).toUpperCase()==='TRUE'))break;if(!constantEqual_(passwordHash_(password,String(r[4])),String(r[3])))break;const user={id:String(r[0]),nama:String(r[1]),username:String(r[2]),role:String(r[5])};const token=Utilities.getUuid()+Utilities.getUuid();CacheService.getScriptCache().put('sipbpd_'+token,JSON.stringify(user),APP.SESSION_TTL);audit_(user,'LOGIN','Sistem','','Login berhasil');return {token:token,user:user};}throw new Error('Username/password salah atau akun tidak aktif.');}
function logout(token){const u=session_(token);CacheService.getScriptCache().remove('sipbpd_'+token);audit_(u,'LOGOUT','Sistem','','Logout');return true;}
function session_(token){if(typeof token!=='string'||token.length<20||token.length>200)throw new Error('Sesi tidak valid. Login kembali.');const raw=CacheService.getScriptCache().get('sipbpd_'+token);if(!raw)throw new Error('Sesi berakhir. Login kembali.');return JSON.parse(raw);}
function passwordHash_(password,salt){let bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,salt+'|'+password,Utilities.Charset.UTF_8);for(let i=0;i<3000;i++)bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes);return Utilities.base64Encode(bytes);}
function constantEqual_(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0;}
function clean_(v,max){return String(v==null?'':v).trim().slice(0,max||10000);}
function sheet_(name){const id=PropertiesService.getScriptProperties().getProperty(APP.SPREADSHEET_KEY);if(!id)throw new Error('Jalankan setupSystem() terlebih dahulu.');const sh=SpreadsheetApp.openById(id).getSheetByName(name);if(!sh)throw new Error('Sheet '+name+' belum tersedia. Jalankan setupSystem().');return sh;}
function moduleInfo_(name){if(BOOKS[name])return {name:name,title:BOOKS[name].title,fields:BOOKS[name].fields,sheet:name,headers:['ID'].concat(BOOKS[name].fields.map(f=>f[0]))};if(MODULE_FIELDS[name])return {name:name,title:name,fields:MODULE_FIELDS[name],sheet:name,headers:CORE[name]};throw new Error('Modul tidak dikenal: '+name);}
function canRead_(u,m){if(m==='Pengguna'||m==='Buku5'||m==='Buku7')return ['Admin BPD','Ketua BPD'].includes(u.role);if(BOOKS[m]||MODULE_FIELDS[m])return ['Admin BPD','Ketua BPD','Anggota BPD','Pemerintah Desa'].includes(u.role);return false;}
function canWrite_(u,m){if(m==='Pengguna'||m==='Buku5'||m==='Buku7')return ['Admin BPD','Ketua BPD'].includes(u.role);if(BOOKS[m]||MODULE_FIELDS[m])return ['Admin BPD','Ketua BPD','Anggota BPD'].includes(u.role);return false;}
function apiBootstrap(token){
  const u=session_(token);
  return {
    user:u,config:getConfig_(),
    books:Object.keys(BOOKS).filter(k=>canRead_(u,k)).map(k=>({id:k,title:BOOKS[k].title,fields:fieldObjects_(BOOKS[k].fields)})),
    modules:Object.keys(MODULE_FIELDS).filter(k=>canRead_(u,k)).map(k=>({id:k,title:k,fields:fieldObjects_(MODULE_FIELDS[k])}))
  };
}
function fieldObjects_(fields){return fields.map(f=>({label:f[0],type:f[1],options:f[2]||[]}));}
function apiDashboard(token){
  const u=session_(token);
  const count=n=>canRead_(u,n)?Math.max(0,sheet_(n).getLastRow()-1):null;
  const bookCounts={};
  Object.keys(BOOKS).forEach(name=>bookCounts[name]=count(name));
  return {anggota:count('Buku7'),suratMasuk:count('Buku2'),suratKeluar:count('Buku1'),aspirasi:count('Aspirasi'),rapat:count('Rapat'),pengawasan:count('Pengawasan'),books:bookCounts};
}
function apiList(token,moduleName,searchText){
  const u=session_(token),info=moduleInfo_(String(moduleName));
  if(!canRead_(u,info.name))throw new Error('Anda tidak memiliki akses membaca modul ini.');
  const sh=sheet_(info.sheet),last=sh.getLastRow(),rows=[];
  const query=clean_(searchText,120).toLocaleLowerCase('id');
  if(last>1){
    const vals=sh.getRange(2,1,last-1,info.headers.length).getDisplayValues();
    vals.forEach(r=>{
      if(!r.some(v=>v!==''))return;
      if(query && !r.join(' ').toLocaleLowerCase('id').includes(query))return;
      rows.push({id:r[0],values:r});
    });
  }
  return {module:info.name,title:info.title,headers:info.headers,fields:fieldObjects_(info.fields),rows:rows,query:query,canWrite:canWrite_(u,info.name),canDelete:['Admin BPD','Ketua BPD'].includes(u.role)};
}
function apiSave(token,moduleName,payload){const u=session_(token),info=moduleInfo_(String(moduleName));if(!canWrite_(u,info.name))throw new Error('Anda tidak memiliki izin menambah atau mengubah data.');if(!payload||typeof payload!=='object')throw new Error('Data formulir tidak valid.');const id=clean_(payload.ID,100)||Utilities.getUuid(),inputValues={};info.fields.forEach(f=>{let v=payload[f[0]];if(f[1]==='number'&&v!==''&&v!=null){v=Number(v);if(!Number.isFinite(v))throw new Error('Nilai angka tidak valid pada '+f[0]);}else {v=clean_(v,10000);if(typeof v==='string'&&/^[=+@]/.test(v))v="'"+v;}if(f[1]==='select'&&v&&!f[2].includes(v))throw new Error('Pilihan tidak valid pada '+f[0]);if(f[1]==='url'&&v&&!/^https:\/\//i.test(v))throw new Error('URL harus diawali https://');inputValues[f[0]]=v==null?'':v;});const sh=sheet_(info.sheet),lock=LockService.getScriptLock();lock.waitLock(10000);try{const last=sh.getLastRow();let found=null;if(payload.ID&&last>1)found=sh.getRange(2,1,last-1,1).createTextFinder(id).matchEntireCell(true).findNext();if(payload.ID&&!found)throw new Error('Data yang akan diubah tidak ditemukan. Muat ulang daftar data.');const existing=found?sh.getRange(found.getRow(),1,1,info.headers.length).getValues()[0]:[];const values=info.headers.map((h,i)=>{if(i===0)return id;if(Object.prototype.hasOwnProperty.call(inputValues,h))return inputValues[h];if(h==='DibuatOleh')return found?(existing[i]||u.nama):u.nama;if(h==='DibuatPada')return found?(existing[i]||new Date()):new Date();return found?existing[i]:'';});if(found){sh.getRange(found.getRow(),1,1,values.length).setValues([values]);audit_(u,'UPDATE',info.name,id,'Data diperbarui');}else{sh.appendRow(values);audit_(u,'CREATE',info.name,id,'Data ditambahkan');}}finally{lock.releaseLock();}return {ok:true,id:id};}
function apiDelete(token,moduleName,id){const u=session_(token),info=moduleInfo_(String(moduleName));if(!['Admin BPD','Ketua BPD'].includes(u.role))throw new Error('Hanya Admin/Ketua BPD yang dapat menghapus data.');id=clean_(id,100);if(!id)throw new Error('ID tidak valid.');const sh=sheet_(info.sheet),last=sh.getLastRow();if(last<2)throw new Error('Data tidak ditemukan.');const lock=LockService.getScriptLock();lock.waitLock(10000);try{const currentLast=sh.getLastRow();if(currentLast<2)throw new Error('Data tidak ditemukan atau sudah dihapus.');const cell=sh.getRange(2,1,currentLast-1,1).createTextFinder(id).matchEntireCell(true).findNext();if(!cell)throw new Error('Data tidak ditemukan atau sudah dihapus.');sh.deleteRow(cell.getRow());audit_(u,'DELETE',info.name,id,'Data dihapus');}finally{lock.releaseLock();}return {ok:true};}
function apiCreateUser(token,data){const u=session_(token);if(!['Admin BPD','Ketua BPD'].includes(u.role))throw new Error('Tidak memiliki izin mengelola pengguna.');const name=clean_(data&&data.nama,120),username=clean_(data&&data.username,40),password=String(data&&data.password||''),role=clean_(data&&data.role,50);if(!name||!/^[a-zA-Z0-9._-]{3,40}$/.test(username)||password.length<12)throw new Error('Nama, username (3–40 karakter), dan password minimal 12 karakter wajib diisi.');if(!ROLES.includes(role))throw new Error('Peran tidak valid.');const sh=sheet_('Pengguna'),lock=LockService.getScriptLock();lock.waitLock(10000);try{const rows=sh.getDataRange().getValues();if(rows.slice(1).some(r=>String(r[2]).toLowerCase()===username.toLowerCase()))throw new Error('Username sudah digunakan.');const salt=Utilities.getUuid()+Utilities.getUuid(),id=Utilities.getUuid();sh.appendRow([id,name,username,passwordHash_(password,salt),salt,role,true,new Date()]);audit_(u,'CREATE','Pengguna',id,'Pengguna baru '+username);}finally{lock.releaseLock();}return {ok:true};}
function getConfig_(){const rows=sheet_('Pengaturan').getDataRange().getValues(),o={};rows.slice(1).forEach(r=>{if(r[0])o[String(r[0])]=r[1];});return o;}
function audit_(u,action,moduleName,recordId,detail){try{sheet_('AuditLog').appendRow([new Date(),u.id||'',u.nama||'',action,moduleName,recordId,clean_(detail,500)]);}catch(e){console.error(e);}}

function systemHealthCheck(){
  const id=PropertiesService.getScriptProperties().getProperty(APP.SPREADSHEET_KEY);
  if(!id)throw new Error('Spreadsheet belum terhubung. Jalankan setupSystem().');
  const ss=SpreadsheetApp.openById(id),missing=[],mismatched=[];
  const defs=Object.assign({},CORE);Object.keys(BOOKS).forEach(k=>defs[k]=['ID'].concat(BOOKS[k].fields.map(f=>f[0])));
  Object.keys(defs).forEach(name=>{const sh=ss.getSheetByName(name);if(!sh){missing.push(name);return;}const actual=sh.getRange(1,1,1,defs[name].length).getDisplayValues()[0];if(actual.join('\u001f')!==defs[name].join('\u001f'))mismatched.push(name);});
  return {ok:!missing.length&&!mismatched.length,spreadsheetName:ss.getName(),sheetCount:ss.getSheets().length,expectedSheetCount:Object.keys(defs).length,missing:missing,mismatched:mismatched};
}
