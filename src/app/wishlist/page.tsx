// src/app/wishlist/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import WishlistList from "@/components/wishlist/WishlistList";

export const metadata = {
  title: "Wishlist - Item Favorit Saya",
  description: "Koleksi item favorit Anda",
};

export default function WishlistPage() {
  return (
    <RequireAuth>
      <WishlistList />
    </RequireAuth>
  );
}
