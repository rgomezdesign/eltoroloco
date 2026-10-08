import { ButtonLink } from "@/components/Button";
export default function NotFound() {
  return (
    <main className="px-5 py-40 text-center">
      <h1 className="t-display-l">This page went loco.</h1>
      <ButtonLink href="/" className="mt-8">Back home</ButtonLink>
    </main>
  );
}
