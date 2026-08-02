import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardMeta, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SquircleBadge } from "@/components/ui/SquircleBadge";
import { BottomNav } from "@/components/ui/BottomNav";
import { Heart } from "lucide-react";

/**
 * Internal style guide — not part of the real app flow.
 * Visit /dev/style-guide during development to sanity-check the core
 * component library against the Figma Design System tokens.
 */
export default function StyleGuidePage() {
  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-24 pt-10">
      <div className="text-center">
        <h1 className="text-heading text-ink">Loverr 💛</h1>
        <p className="text-body-medium text-muted">
          Component library preview — fondasi siap.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SquircleBadge color="rose">
          <Heart size={22} className="fill-white" />
        </SquircleBadge>
        <SquircleBadge color="coral">
          <Heart size={22} className="fill-white" />
        </SquircleBadge>
        <SquircleBadge color="violet">
          <Heart size={22} className="fill-white" />
        </SquircleBadge>
        <SquircleBadge color="periwinkle">
          <Heart size={22} className="fill-white" />
        </SquircleBadge>
      </div>

      <Card color="coral">
        <CardTitle>Kenangan Hari Ini</CardTitle>
        <CardMeta>3 Juli 2026 · Ink text, bukan putih</CardMeta>
      </Card>

      <Card color="violet">
        <CardTitle>Quiz Mingguan</CardTitle>
        <CardMeta>Jawab bareng pasanganmu</CardMeta>
      </Card>

      <Card color="surface">
        <CardBody>Card netral untuk konten biasa.</CardBody>
      </Card>

      <Input label="Nama panggilan" placeholder="Masukkan nama" />
      <Input label="PIN" placeholder="••••" error="PIN salah, coba lagi" />

      <div className="flex flex-col gap-3">
        <Button variant="primary">Simpan Kenangan</Button>
        <Button variant="secondary">Batal</Button>
        <Button variant="ghost">Lewati</Button>
        <Button variant="primary" disabled>
          Nonaktif
        </Button>
      </div>

      <BottomNav />
    </main>
  );
}
