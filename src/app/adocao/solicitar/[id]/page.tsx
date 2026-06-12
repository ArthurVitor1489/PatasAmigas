import SolicitarAdocaoClient from "./SolicitarAdocaoClient";

export function generateStaticParams() {
  return [
    { id: "a1" },
    { id: "a2" },
    { id: "a3" },
    { id: "a4" },
  ];
}

export default function Page() {
  return <SolicitarAdocaoClient />;
}
