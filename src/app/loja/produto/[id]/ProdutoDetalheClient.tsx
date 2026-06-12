"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp, Product } from "@/context/AppContext";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  Scale, 
  Maximize2, 
  Check, 
  AlertTriangle 
} from "lucide-react";

export default function ProdutoDetalhe() {
  const params = useParams();
  const router = useRouter();
  const { products, categories, addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  
  // Gallery active photo
  const [activeImg, setActiveImg] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: "none", backgroundPosition: "0% 0%" });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  useEffect(() => {
    const prodId = params.id as string;
    const found = products.find((p) => p.id === prodId);
    if (found) {
      setProduct(found);
      setActiveImg(found.images[0]);
      
      // Load or generate dummy reviews
      const storedReviews = localStorage.getItem(`reviews_${prodId}`);
      if (storedReviews) {
        setReviewsList(JSON.parse(storedReviews));
      } else {
        const dummyReviews = [
          { name: "Mariana S.", rating: 5, date: "2 meses atrás", comment: "Excelente qualidade! Meu cão adorou o produto, super recomendo." },
          { name: "Carlos D.", rating: 4, date: "1 mês atrás", comment: "Muito bonito, acabamento impecável. A entrega foi rápida." },
        ];
        localStorage.setItem(`reviews_${prodId}`, JSON.stringify(dummyReviews));
        setReviewsList(dummyReviews);
      }
    }
  }, [params.id, products]);

  if (!product) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-xl font-bold">Produto não encontrado</h2>
        <Link href="/loja" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category_id);

  // Filter related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  // Hover zoom simulation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const newRev = {
      name: "Você (Cliente)",
      rating: userRating,
      date: "Agora mesmo",
      comment: userComment,
    };
    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
    
    // reset form
    setUserComment("");
  };

  return (
    <div className="flex flex-col gap-16 py-4 text-left">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-semibold transition-colors w-fit"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar para a lista
      </button>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Photos Gallery & Main Preview with Zoom */}
        <div className="flex flex-col gap-4">
          {/* Main Photo container */}
          <div 
            className="relative bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl aspect-square overflow-hidden cursor-crosshair group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {/* Zoom overlay lens */}
            <div 
              className="absolute inset-0 bg-no-repeat pointer-events-none transition-shadow duration-300"
              style={{
                ...zoomStyle,
                backgroundImage: `url(${activeImg})`,
                backgroundSize: "200%",
              }}
            ></div>
            <span className="absolute bottom-4 right-4 bg-black/60 text-white rounded-lg p-2 flex items-center justify-center pointer-events-none opacity-80 text-xs gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              Passe o mouse para dar zoom
            </span>
          </div>

          {/* Thumbnail grid */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 transition-all ${
                    activeImg === img ? "border-primary-500 scale-102" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {category && (
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full w-fit uppercase tracking-wider">
                {category.name}
              </span>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">{product.name}</h1>
          </div>

          {/* Reviews Rating summary */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="h-4.5 w-4.5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              (5.0 de {reviewsList.length} avaliações)
            </span>
          </div>

          {/* Price */}
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Preço Solidário</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
              100% revertido para a causa
            </span>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 text-sm border-y border-slate-200 dark:border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Peso:</span>
              <span className="font-bold">{(product.weight / 1000).toFixed(2)} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Dimensões:</span>
              <span className="font-bold">{product.dimensions}</span>
            </div>
          </div>

          {/* Stock state */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
                  Em estoque ({product.stock} unidades disponíveis)
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-brand-rose" />
                <span className="text-xs font-bold text-brand-rose">
                  Produto esgotado no momento
                </span>
              </>
            )}
          </div>

          {/* Purchase Actions */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 p-1">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="h-9 w-9 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-lg"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="h-9 w-9 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                  added 
                    ? "bg-emerald-600 text-white shadow-emerald-500/20" 
                    : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/10 hover:shadow-primary-500/20 hover:-translate-y-0.5"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Adicionado ao Carrinho!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2 mt-2">
            <h3 className="font-bold text-base">Descrição do Produto</h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews list */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Avaliações do Produto</h2>
            <div className="flex flex-col gap-4">
              {reviewsList.map((rev, idx) => (
                <div key={idx} className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{rev.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star key={sIdx} className={`h-3.5 w-3.5 ${sIdx < rev.rating ? "fill-current" : "text-slate-300"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Leave a review */}
          <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-base mb-4">Deixe sua avaliação</h3>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Sua Nota</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-6 w-6 ${star <= userRating ? "fill-current" : "text-slate-350"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Comentário</label>
                <textarea
                  required
                  placeholder="Escreva sua opinião sincera sobre o produto..."
                  rows={4}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-500/10"
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-200 dark:border-slate-800 pt-12 flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Quem comprou este produto também se interessou:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <Link 
                key={prod.id} 
                href={`/loja/produto/${prod.id}`}
                className="group glass border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1.5">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{prod.name}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{prod.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 flex justify-between items-center mt-auto">
                  <span className="text-sm font-extrabold">R$ {prod.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  <span className="text-[10px] font-bold text-primary-600 uppercase">Ver mais</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
