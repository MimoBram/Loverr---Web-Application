/**
 * Flat key -> { id, en } dictionary for the whole app. Kept as one file
 * (rather than per-namespace files) since the app is small enough that a
 * single source of truth is easier to keep in sync than hunting across
 * many files for a given screen's copy.
 *
 * Keys are dot-namespaced by screen (e.g. "home.greeting") purely for
 * readability — there's no runtime nesting, `t()` just does a flat lookup.
 */
export const dictionary = {
  // Splash
  "splash.tagline": { id: "Ruang kenangan berdua, tiap hari", en: "A shared space for everyday memories" },
  "splash.cta.ready": { id: "Mulai", en: "Get Started" },
  "splash.cta.loading": { id: "Menyiapkan…", en: "Setting up…" },

  // Pilih Profil
  "pilihProfil.title": { id: "Siapa yang masuk?", en: "Who's logging in?" },
  "pilihProfil.preparing": { id: "Menyiapkan ruang kenangan…", en: "Setting up your memory space…" },
  "pilihProfil.bootstrapError": {
    id: "Gagal menyiapkan akun bersama: {message}. PIN mungkin belum ter-update — coba refresh halaman ini.",
    en: "Failed to set up the shared account: {message}. Your PIN may not be updated yet — try refreshing this page.",
  },

  // Masukkan PIN
  "masukkanPin.greeting": { id: "Hai, {name}", en: "Hi, {name}" },
  "masukkanPin.subtitle": { id: "Masukkan PIN kamu", en: "Enter your PIN" },
  "masukkanPin.wrong": { id: "PIN salah, coba lagi.", en: "Wrong PIN, try again." },
  "masukkanPin.bootstrapError": { id: "Akun bersama gagal disiapkan: {message}", en: "Failed to set up shared account: {message}" },
  "masukkanPin.notFound": { id: "Profil tidak ditemukan.", en: "Profile not found." },
  "masukkanPin.backToPilihProfil": { id: "Kembali ke Pilih Profil", en: "Back to Choose Profile" },

  // Home
  "home.greeting": { id: "Halo, sayang :)", en: "Hey, love :)" },
  "home.lastMoment": { id: "MOMEN TERAKHIR", en: "LATEST MOMENT" },
  "home.noEntry": { id: "Belum ada kenangan — yuk tambahkan!", en: "No memories yet — let's add one!" },
  "home.scrapbook": { id: "Scrapbook", en: "Scrapbook" },
  "home.scrapbookDesc": { id: "Timeline momen", en: "Moment timeline" },
  "home.notesQuiz": { id: "Notes & Quiz", en: "Notes & Quiz" },
  "home.notesQuizDesc": { id: "Pesan & tebakan", en: "Messages & guesses" },
  "home.streakActive": { id: "{count} hari beruntun", en: "{count}-day streak" },
  "home.streakNone": { id: "Belum ada streak", en: "No streak yet" },
  "home.streakDesc": { id: "Aktif tiap nambah kenangan, kirim catatan, atau jawab kuis", en: "Stays active whenever you add a memory, send a note, or answer a quiz" },
  "home.recentActivity": { id: "Aktivitas Terbaru", en: "Recent Activity" },
  "home.loadingActivity": { id: "Memuat aktivitas…", en: "Loading activity…" },
  "home.errorActivity": { id: "Gagal memuat aktivitas. Coba muat ulang halaman.", en: "Couldn't load activity. Try reloading the page." },
  "home.noActivity": { id: "Belum ada aktivitas baru.", en: "No recent activity yet." },
  "home.timeAgo.now": { id: "Baru saja", en: "Just now" },
  "home.timeAgo.hours": { id: "{count} jam lalu", en: "{count}h ago" },
  "home.timeAgo.days": { id: "{count} hari lalu", en: "{count}d ago" },

  // Timeline (list)
  "timeline.title": { id: "Scrapbook", en: "Scrapbook" },
  "timeline.momentsSaved": { id: "{count} momen tersimpan", en: "{count} moments saved" },
  "timeline.addMemory": { id: "Tambah kenangan", en: "Add memory" },
  "timeline.loading": { id: "Memuat kenangan…", en: "Loading memories…" },
  "timeline.error": { id: "Gagal memuat kenangan. Coba muat ulang halaman.", en: "Couldn't load memories. Try reloading the page." },
  "timeline.emptyTap": { id: "Belum ada kenangan tersimpan. Tap tombol + untuk mulai.", en: "No memories saved yet. Tap the + button to start." },

  // Entry Detail
  "entryDetail.title": { id: "Detail Momen", en: "Moment Details" },
  "entryDetail.loading": { id: "Memuat kenangan…", en: "Loading memory…" },
  "entryDetail.notFound": { id: "Kenangan tidak ditemukan.", en: "Memory not found." },
  "entryDetail.backToScrapbook": { id: "Kembali ke Scrapbook", en: "Back to Scrapbook" },
  "entryDetail.story": { id: "CERITA", en: "STORY" },
  "entryDetail.edit": { id: "Edit", en: "Edit" },
  "entryDetail.delete": { id: "Hapus", en: "Delete" },
  "entryDetail.deleting": { id: "Menghapus…", en: "Deleting…" },
  "entryDetail.shareCopied": { id: "Tautan disalin ke clipboard.", en: "Link copied to clipboard." },
  "entryDetail.opsiMomen": { id: "Opsi Momen", en: "Moment Options" },
  "entryDetail.share": { id: "Bagikan Momen", en: "Share Moment" },
  "entryDetail.favoriteOn": { id: "Batal Favoritkan", en: "Remove from Favorites" },
  "entryDetail.favoriteOff": { id: "Tandai Favorit", en: "Mark as Favorite" },
  "entryDetail.viewTimeline": { id: "Lihat di Timeline", en: "View in Timeline" },
  "entryDetail.confirmTitle": { id: "Hapus Kenangan Ini?", en: "Delete This Memory?" },
  "entryDetail.confirmDesc": { id: "Tindakan ini tidak bisa dibatalkan. Foto dan cerita akan hilang permanen.", en: "This can't be undone. The photo and story will be gone for good." },
  "entryDetail.confirmYes": { id: "Ya, Hapus", en: "Yes, Delete" },
  "entryDetail.moodAria": { id: "Mood: {mood}", en: "Mood: {mood}" },

  // New Entry / Edit
  "newEntry.titleNew": { id: "Entri Baru", en: "New Entry" },
  "newEntry.titleEdit": { id: "Edit Kenangan", en: "Edit Memory" },
  "newEntry.loading": { id: "Memuat kenangan…", en: "Loading memory…" },
  "newEntry.tapPhoto": { id: "Ketuk untuk tambah foto", en: "Tap to add a photo" },
  "newEntry.storyLabel": { id: "CERITA SINGKAT", en: "SHORT STORY" },
  "newEntry.storyPlaceholder": { id: "Tulis cerita singkat tentang momen ini...", en: "Write a short story about this moment..." },
  "newEntry.tagsLabel": { id: "TAG MOMEN", en: "MOMENT TAGS" },
  "newEntry.dateLabel": { id: "TANGGAL", en: "DATE" },
  "newEntry.moodLabel": { id: "MOOD", en: "MOOD" },
  "newEntry.saveNew": { id: "Simpan Entri", en: "Save Entry" },
  "newEntry.saveEdit": { id: "Simpan Perubahan", en: "Save Changes" },
  "newEntry.saving": { id: "Menyimpan…", en: "Saving…" },
  "newEntry.error": { id: "Gagal menyimpan kenangan. Coba lagi.", en: "Couldn't save the memory. Try again." },
  "newEntry.defaultTitle": { id: "Kenangan baru", en: "New memory" },
  "newEntry.notifBody": { id: '{name} menambahkan "{title}" ke Scrapbook.', en: '{name} added "{title}" to the Scrapbook.' },
  "newEntry.notifTitle": { id: "Kenangan baru ditambahkan", en: "New memory added" },
  "newEntry.removePhoto": { id: "Hapus foto", en: "Remove photo" },
  "newEntry.addTag": { id: "Tambah tag", en: "Add tag" },
  "newEntry.photoPreviewAlt": { id: "Pratinjau foto", en: "Photo preview" },
  "newEntry.someone": { id: "Seseorang", en: "Someone" },

  // Notes & Quiz Hub
  "notesHub.title": { id: "Notes & Quiz", en: "Notes & Quiz" },
  "notesHub.notesSection": { id: "Catatan Untukmu", en: "Notes for You" },
  "notesHub.loading": { id: "Memuat catatan…", en: "Loading notes…" },
  "notesHub.error": { id: "Gagal memuat catatan. Coba muat ulang halaman.", en: "Couldn't load notes. Try reloading the page." },
  "notesHub.composePrompt": { id: "Tulis catatan untuk pasanganmu...", en: "Write a note for your partner..." },
  "notesHub.yourReply": { id: "Balasan kamu", en: "Your reply" },
  "notesHub.quizSection": { id: "Quiz Mingguan", en: "Weekly Quiz" },
  "notesHub.noQuestions": { id: "Belum ada pertanyaan quiz.", en: "No quiz questions yet." },
  "notesHub.answered": { id: "Sudah dijawab", en: "Answered" },
  "notesHub.tapToAnswer": { id: "Ketuk untuk jawab", en: "Tap to answer" },
  "notesHub.subtitle": { id: "Ruang ngobrol kalian", en: "Your space to chat" },
  "notesHub.composeAria": { id: "Tulis catatan baru", en: "Write a new note" },
  "notesHub.todayLabel": { id: "PESAN HARI INI", en: "TODAY'S MESSAGE" },
  "notesHub.fromPartner": { id: "Dari pasanganmu", en: "From your partner" },
  "notesHub.noMessageToday": { id: "Belum ada pesan hari ini", en: "No message today yet" },
  "notesHub.quizLabel": { id: "KUIS UNTUK KAMU", en: "QUIZ FOR YOU" },
  "notesHub.viewAll": { id: "Lihat semua", en: "View all" },
  "common.justNow": { id: "Baru saja", en: "Just now" },
  "common.hoursAgo": { id: "{hours} jam lalu", en: "{hours}h ago" },
  "common.yesterday": { id: "Kemarin", en: "Yesterday" },
  "common.daysAgo": { id: "{days} hari lalu", en: "{days}d ago" },

  // Note Compose
  "noteCompose.title": { id: "Balas Catatan", en: "Reply to Note" },
  "noteCompose.from": { id: "Dari pasanganmu", en: "From your partner" },
  "noteCompose.placeholder": { id: "Tulis balasanmu di sini...", en: "Write your reply here..." },
  "noteCompose.send": { id: "Kirim", en: "Send" },
  "noteCompose.sending": { id: "Mengirim…", en: "Sending…" },
  "noteCompose.error": { id: "Gagal mengirim catatan. Coba lagi.", en: "Couldn't send the note. Try again." },
  "noteCompose.notifTitle": { id: "Catatan baru dari {name}", en: "New note from {name}" },
  "noteCompose.writeReplyLabel": { id: "TULIS BALASAN", en: "WRITE A REPLY" },
  "noteCompose.quickReactionsLabel": { id: "REAKSI CEPAT", en: "QUICK REACTIONS" },
  "noteCompose.emptyError": { id: "Tulis sesuatu dulu sebelum dikirim.", en: "Write something before sending." },
  "noteCompose.footer": { id: "Balasan akan langsung terkirim ke pasanganmu 💌", en: "Your reply will be sent to your partner right away 💌" },
  "common.partner": { id: "pasanganmu", en: "your partner" },

  // Quiz Hub (weekly quiz list)
  "quizHub.title": { id: "Quiz Mingguan", en: "Weekly Quiz" },
  "quizHub.loading": { id: "Memuat pertanyaan…", en: "Loading questions…" },
  "quizHub.error": { id: "Gagal memuat pertanyaan. Coba muat ulang halaman.", en: "Couldn't load questions. Try reloading the page." },
  "quizHub.empty": { id: "Belum ada pertanyaan quiz.", en: "No quiz questions yet." },
  "quizHub.emptyCategory": { id: "Belum ada pertanyaan di kategori ini.", en: "No questions in this category yet." },
  "quizHub.resultReady": { id: "Hasil siap", en: "Result ready" },
  "quizHub.waiting": { id: "Menunggu", en: "Waiting" },

  // Quiz Interaction
  "quiz.soal": { id: "Soal {current}/{total}", en: "Question {current}/{total}" },
  "quiz.notFound": { id: "Pertanyaan tidak ditemukan.", en: "Question not found." },
  "quiz.backToQuiz": { id: "Kembali ke Quiz", en: "Back to Quiz" },
  "quiz.loading": { id: "Memuat pertanyaan…", en: "Loading question…" },
  "quiz.progress": { id: "Progress", en: "Progress" },
  "quiz.answerPlaceholder": { id: "Tulis jawabanmu...", en: "Write your answer..." },
  "quiz.error": { id: "Gagal mengirim jawaban. Coba lagi.", en: "Couldn't submit the answer. Try again." },
  "quiz.skip": { id: "Lewati", en: "Skip" },
  "quiz.cancel": { id: "Batal", en: "Cancel" },
  "quiz.send": { id: "Kirim", en: "Send" },
  "quiz.sending": { id: "Mengirim…", en: "Sending…" },
  "quiz.retryingNote": { id: "Mengulangi jawabanmu — kirim untuk menggantikan jawaban lama.", en: "Redoing your answer — submit to replace the old one." },
  "quiz.submitted": { id: "Jawabanmu terkirim!", en: "Your answer is in!" },
  "quiz.waitingPartner": { id: "Menunggu pasanganmu menjawab juga — hasilnya akan muncul di sini.", en: "Waiting for your partner to answer too — the result will show up here." },
  "quiz.opsiKuis": { id: "Opsi Kuis", en: "Quiz Options" },
  "quiz.retry": { id: "Ulangi Kuis", en: "Redo Quiz" },
  "quiz.report": { id: "Laporkan Soal", en: "Report Question" },
  "quiz.exit": { id: "Keluar dari Kuis", en: "Exit Quiz" },
  "quiz.resultReadyTitle": { id: "Hasil quiz siap!", en: "Quiz result is ready!" },
  "quiz.resultReadyBody": { id: 'Jawaban untuk "{question}" sudah lengkap — cek hasilnya!', en: 'Answers for "{question}" are complete — check the result!' },

  // Quiz Result
  "quizResult.title": { id: "Hasil Kuis", en: "Quiz Result" },
  "quizResult.match": { id: "Jawaban Kalian Cocok!", en: "Your Answers Match!" },
  "quizResult.noMatch": { id: "Jawaban Kalian Beda-beda!", en: "Your Answers Are Different!" },
  "quizResult.yourAnswer": { id: "JAWABANMU", en: "YOUR ANSWER" },
  "quizResult.partnerAnswer": { id: "JAWABAN SAYANG", en: "PARTNER'S ANSWER" },
  "quizResult.nextQuestion": { id: "Lanjut ke Soal Berikutnya", en: "Next Question" },
  "quizResult.backToQuiz": { id: "Kembali ke Quiz", en: "Back to Quiz" },
  "quizResult.loading": { id: "Memuat hasil…", en: "Loading result…" },
  "quizResult.notFound": { id: "Hasil tidak ditemukan.", en: "Result not found." },
  "quizResult.finish": { id: "Selesai", en: "Finish" },
  "quizResult.backToNotes": { id: "Kembali ke Notes & Quiz", en: "Back to Notes & Quiz" },

  // Notifications
  "notifications.title": { id: "Notifikasi", en: "Notifications" },
  "notifications.loading": { id: "Memuat notifikasi…", en: "Loading notifications…" },
  "notifications.error": { id: "Gagal memuat notifikasi. Coba muat ulang halaman.", en: "Couldn't load notifications. Try reloading the page." },
  "notifications.empty": { id: "Belum ada notifikasi.", en: "No notifications yet." },
  "notifications.today": { id: "HARI INI", en: "TODAY" },
  "notifications.yesterday": { id: "KEMARIN", en: "YESTERDAY" },
  "notifications.thisWeek": { id: "MINGGU INI", en: "THIS WEEK" },
  "notifications.older": { id: "LEBIH LAMA", en: "OLDER" },

  // Profile
  "profile.title": { id: "Profil & Pengaturan", en: "Profile & Settings" },
  "profile.since": { id: "Bersama sejak {date}", en: "Together since {date}" },
  "profile.section.account": { id: "Akun", en: "Account" },
  "profile.section.app": { id: "Aplikasi", en: "App" },
  "profile.editProfile": { id: "Edit Profil", en: "Edit Profile" },
  "profile.changePin": { id: "Ganti PIN", en: "Change PIN" },
  "profile.notifications": { id: "Notifikasi", en: "Notifications" },
  "profile.theme": { id: "Tema Tampilan", en: "Appearance" },
  "profile.language": { id: "Bahasa", en: "Language" },
  "profile.about": { id: "Tentang Aplikasi", en: "About the App" },
  "profile.logout": { id: "Keluar", en: "Log Out" },
  "profile.section.other": { id: "Lainnya", en: "Other" },
  "nav.profile": { id: "Profil", en: "Profile" },
  "common.offline": { id: "Kamu sedang offline. Beberapa data mungkin tidak terbaru.", en: "You're offline. Some data may be out of date." },

  // Edit Profil
  "editProfile.title": { id: "Edit Profil", en: "Edit Profile" },
  "editProfile.nameLabel": { id: "Nama Panggilan", en: "Display Name" },
  "editProfile.save": { id: "Simpan", en: "Save" },
  "editProfile.saving": { id: "Menyimpan…", en: "Saving…" },
  "editProfile.saved": { id: "Tersimpan!", en: "Saved!" },
  "editProfile.nameEmpty": { id: "Nama tidak boleh kosong.", en: "Name can't be empty." },
  "editProfile.saveError": { id: "Gagal menyimpan perubahan. Coba lagi.", en: "Couldn't save changes. Try again." },
  "editProfile.chooseAvatar": { id: "Pilih avatar {key}", en: "Choose avatar {key}" },

  // Ganti PIN
  "changePin.title": { id: "Ganti PIN", en: "Change PIN" },
  "changePin.currentLabel": { id: "PIN Saat Ini", en: "Current PIN" },
  "changePin.newLabel": { id: "PIN Baru (6 digit)", en: "New PIN (6 digits)" },
  "changePin.confirmLabel": { id: "Konfirmasi PIN Baru", en: "Confirm New PIN" },
  "changePin.save": { id: "Simpan", en: "Save" },
  "changePin.saving": { id: "Menyimpan…", en: "Saving…" },
  "changePin.saved": { id: "PIN berhasil diganti!", en: "PIN changed successfully!" },
  "changePin.errorLength": { id: "PIN baru harus 6 digit angka.", en: "New PIN must be 6 digits." },
  "changePin.errorMismatch": { id: "Konfirmasi PIN tidak cocok.", en: "PIN confirmation doesn't match." },
  "changePin.errorCurrent": { id: "PIN saat ini salah.", en: "Current PIN is incorrect." },
  "changePin.errorGeneric": { id: "Gagal mengganti PIN. Coba lagi.", en: "Couldn't change the PIN. Try again." },

  // Notification settings
  "notifSettings.title": { id: "Notifikasi", en: "Notifications" },
  "notifSettings.entries": { id: "Kenangan Baru", en: "New Memories" },
  "notifSettings.entriesDesc": { id: "Saat pasanganmu menambah kenangan", en: "When your partner adds a memory" },
  "notifSettings.notes": { id: "Catatan Baru", en: "New Notes" },
  "notifSettings.notesDesc": { id: "Saat pasanganmu mengirim catatan", en: "When your partner sends a note" },
  "notifSettings.quiz": { id: "Quiz", en: "Quiz" },
  "notifSettings.quizDesc": { id: "Pengingat dan hasil quiz", en: "Quiz reminders and results" },

  // Theme settings
  "themeSettings.title": { id: "Tema Tampilan", en: "Appearance" },
  "themeSettings.light": { id: "Terang", en: "Light" },
  "themeSettings.lightDesc": { id: "Tampilan cerah default Loverr", en: "Loverr's default bright look" },
  "themeSettings.dark": { id: "Gelap", en: "Dark" },
  "themeSettings.darkDesc": { id: "Tampilan gelap yang nyaman di mata", en: "An easy-on-the-eyes dark look" },

  // Language settings
  "langSettings.title": { id: "Bahasa", en: "Language" },
  "langSettings.id": { id: "Bahasa Indonesia", en: "Indonesian" },
  "langSettings.en": { id: "English", en: "English" },

  // About
  "about.title": { id: "Tentang Aplikasi", en: "About the App" },
  "about.appName": { id: "Loverr", en: "Loverr" },
  "about.version": { id: "Versi 1.0.0", en: "Version 1.0.0" },
  "about.description": {
    id: "Loverr adalah ruang pribadi untuk kalian berdua — scrapbook kenangan, catatan harian, dan quiz seru untuk makin mengenal satu sama lain.",
    en: "Loverr is a private space just for the two of you — a memory scrapbook, daily notes, and fun quizzes to get to know each other even better.",
  },
  "about.madeWith": { id: "Dibuat dengan 💛 untuk Mimo & Odyy", en: "Made with 💛 for Mimo & Odyy" },
  "about.builtWith": { id: "Dibangun dengan Next.js, Tailwind CSS, dan Supabase.", en: "Built with Next.js, Tailwind CSS, and Supabase." },

  // Common
  "common.back": { id: "Kembali", en: "Back" },
  "common.delete": { id: "Hapus", en: "Delete" },
} as const;

export type DictionaryKey = keyof typeof dictionary;
