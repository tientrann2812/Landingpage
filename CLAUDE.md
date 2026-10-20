# Landingpage: project video Remotion

Project làm video bằng Remotion (React + TypeScript).

## Người dùng
- Người mới, dùng Windows + PowerShell. Trả lời bằng tiếng Việt, hướng dẫn từng bước đơn giản, xưng "mình" và gọi người dùng là "fen".
- Project trên máy họ nằm ở `C:\Users\Admin\Landingpage`. Git, Node.js và ExecutionPolicy RemoteSigned đã được cài đặt sẵn.
- Họ lấy bản mới và xem bằng cách chạy: `cd Landingpage`, `git pull`, `npm run dev` (Studio ở http://localhost:3000).

## Cấu trúc
- `src/index.ts`: `registerRoot(RemotionRoot)`
- `src/Root.tsx`: khai báo các `<Composition>`. Mỗi video mới thêm một Composition với `id` riêng.
- `src/HelloWorld.tsx`: video mẫu 1920x1080, 30fps, 90 frame (chữ fade-in).
- Scripts: `npm run dev` (Studio), `npm run render` (render HelloWorld ra `out/video.mp4`).

## Quy trình mỗi khi làm video
1. Viết composition mới trong `src/` và đăng ký nó trong `src/Root.tsx`.
2. Chạy `npx tsc` để kiểm tra lỗi.
3. Render thử rồi gửi file MP4 cho người dùng xem trước:
   `npx remotion render src/index.ts <CompositionId> out/<ten>.mp4`
   Ở môi trường cloud, Remotion không tải được Chrome, nên thêm:
   `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
4. Commit rồi push lên nhánh `master` (không commit `out/`). Sau đó nhắc người dùng chạy `git pull`.

## Đăng bài mạng xã hội (Zapier → Buffer)
- Đăng qua Zapier connector → Buffer, action "Add to Queue". Buffer có 3 kênh: TikTok `ryyfc.legit`, YouTube `Ryy TV`, Facebook Page `Ryy TV` (múi giờ Asia/Ho_Chi_Minh).
- Video nằm trên Google Drive `tientran.dth98@gmail.com`. File phải để "Bất kỳ ai có đường liên kết" (người dùng tự bật, Drive tool không bật được). Link video cho Buffer: `https://drive.usercontent.google.com/download?id=<FILE_ID>&export=download&confirm=t`
- Bảng lịch: Google Sheet "Lich dang MXH" (id `1eNS8ilU7wMouUwwZ-CGzU5PaKBZ5UEJS3ueYSEuFxug`), cột: Ten file video, Trang dang, Ngay dang, Gio dang, Caption, Hashtag, Trang thai (`Cho` / `Da hen gio` / `Da dang`), Link bai dang, Ghi chu. Cập nhật trạng thái sau khi đăng/hẹn giờ.
- Caption: người dùng ghi sao thì đăng y vậy, không tự thêm nội dung. Được phép thêm 1 câu kêu gọi bình luận (CTA).
- Hashtag cố định theo nền tảng (`<game>` = tên game viết liền, ví dụ `themimic`):
  - TikTok: `#ryyrauram #<game> #gamingontiktok`
  - YouTube (Shorts): `#shorts #ryytv`; tiêu đề dạng `<Tên game> Phần N - <caption> | Ryy TV`, danh mục Gaming, công khai, không dành cho trẻ em.
  - Facebook: `#<TênGame> #Ryy`
