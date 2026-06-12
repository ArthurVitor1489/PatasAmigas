import ProdutoDetalheClient from "./ProdutoDetalheClient";

export function generateStaticParams() {
  return [
    { id: "p1" },
    { id: "p2" },
    { id: "p3" },
    { id: "p4" },
    { id: "p5" },
  ];
}

export default function Page() {
  return <ProdutoDetalheClient />;
}
