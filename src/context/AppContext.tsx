"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin" | "moderator";
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight: number; // in grams
  dimensions: string;
  category_id: string;
  images: string[];
  featured: boolean;
}

export interface Animal {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: string;
  size: "small" | "medium" | "large";
  temperament: string;
  history: string;
  health_status: string[]; // e.g., ["Vacinado", "Castrado", "Vermifugado"]
  special_needs?: string;
  status: "available" | "pending" | "adopted";
  images: string[];
  featured: boolean;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total: number;
  coupon_code?: string;
  shipping_address: any;
  shipping_cost: number;
  payment_method: "pix" | "card" | "boleto";
  items: OrderItem[];
  created_at: string;
}

export interface Donation {
  id: string;
  user_id?: string;
  user_name: string;
  type: "one_time" | "recurring";
  amount: number;
  status: "paid" | "pending" | "failed";
  frequency?: "monthly" | "quarterly" | "yearly";
  animal_id?: string; // If sponsoring a specific animal
  created_at: string;
}

export interface Sponsor {
  id: string;
  user_id: string;
  user_name: string;
  animal_id: string;
  animal_name: string;
  monthly_amount: number;
  status: "active" | "paused" | "cancelled";
  start_date: string;
}

export interface AdoptionRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  animal_id: string;
  animal_name: string;
  status: "pending" | "interview" | "approved" | "rejected";
  answers: {
    fullName: string;
    cpf: string;
    phone: string;
    whatsapp: string;
    address: string;
    residenceType: string;
    hasYard: string;
    hadPetBefore: string;
    howManyPets: string;
    reason: string;
  };
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  slug: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  currentUser: User | null;
  categories: Category[];
  products: Product[];
  animals: Animal[];
  orders: Order[];
  donations: Donation[];
  sponsors: Sponsor[];
  adoptionRequests: AdoptionRequest[];
  articles: Article[];
  cart: CartItem[];
  coupon: { code: string; discount: number } | null;
  shippingCost: number | null;
  login: (email: string, role?: "client" | "admin") => boolean;
  logout: () => void;
  registerUser: (name: string, email: string, phone?: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  calculateShipping: (zip: string) => number;
  checkout: (paymentMethod: "pix" | "card" | "boleto", address: any) => Order;
  makeDonation: (amount: number, type: "one_time" | "recurring", frequency?: "monthly" | "quarterly" | "yearly", animalId?: string) => void;
  submitAdoptionRequest: (animalId: string, answers: any) => void;
  
  // Admin functions
  createProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  createAnimal: (animal: Omit<Animal, "id" | "status">) => void;
  updateAnimal: (animal: Animal) => void;
  deleteAnimal: (id: string) => void;
  updateAdoptionRequestStatus: (id: string, status: "pending" | "interview" | "approved" | "rejected") => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  createArticle: (article: Omit<Article, "id" | "created_at" | "slug">) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Checkout & Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);

  // Initialize DB from LocalStorage or Seed Data
  useEffect(() => {
    // 1. Categories
    const localCategories = localStorage.getItem("ong_categories");
    if (localCategories) {
      setCategories(JSON.parse(localCategories));
    } else {
      const seedCategories: Category[] = [
        { id: "c1", name: "Caminhas", slug: "caminhas" },
        { id: "c2", name: "Roupinhas", slug: "roupinhas" },
        { id: "c3", name: "Brinquedos", slug: "brinquedos" },
        { id: "c4", name: "Higiene & Acessórios", slug: "higiene-acessorios" },
        { id: "c5", name: "Artesanato da ONG", slug: "artesanato" },
      ];
      localStorage.setItem("ong_categories", JSON.stringify(seedCategories));
      setCategories(seedCategories);
    }

    // 2. Products
    const localProducts = localStorage.getItem("ong_products");
    if (localProducts) {
      setProducts(JSON.parse(localProducts));
    } else {
      const seedProducts: Product[] = [
        {
          id: "p1",
          name: "Cama Soft Nuvem Extra Conforto",
          description: "Cama ortopédica ultra-macia, ideal para cães e gatos de pequeno a médio porte. Enchimento premium siliconado que não deforma.",
          price: 129.90,
          stock: 15,
          weight: 1200,
          dimensions: "50x50x15 cm",
          category_id: "c1",
          images: [
            "https://images.unsplash.com/photo-1541599540903-216a46ca1fc0?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80"
          ],
          featured: true
        },
        {
          id: "p2",
          name: "Moletom Pet 'Patas Amigas' Edição Especial",
          description: "Moletom térmico super quentinho para cães e gatos enfrentarem o frio com muito estilo. 100% algodão escovado. Todo o lucro é revertido para a ONG.",
          price: 69.90,
          stock: 25,
          weight: 250,
          dimensions: "30x20x2 cm",
          category_id: "c2",
          images: [
            "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80"
          ],
          featured: true
        },
        {
          id: "p3",
          name: "Brinquedo Mordedor Interativo Porta-Petisco",
          description: "Feito de borracha natural não tóxica de alta resistência. Ajuda a limpar os dentes e reduz o estresse do animal, estimulando a mente.",
          price: 39.90,
          stock: 40,
          weight: 180,
          dimensions: "12x8x8 cm",
          category_id: "c3",
          images: [
            "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80"
          ],
          featured: false
        },
        {
          id: "p4",
          name: "Chaveiro Patas Amigas em Macramê",
          description: "Feito manualmente pelas nossas voluntárias usando cordão de algodão ecológico. Um acessório lindo para apoiar nossa causa.",
          price: 25.00,
          stock: 50,
          weight: 40,
          dimensions: "10x4x1 cm",
          category_id: "c5",
          images: [
            "https://images.unsplash.com/photo-1606722590583-6d6c448be485?w=600&auto=format&fit=crop&q=80"
          ],
          featured: true
        },
        {
          id: "p5",
          name: "Eco-Shampoo Sólido Hipoalergênico para Pets",
          description: "Shampoo em barra 100% natural, vegano e biodegradável. Livre de parabenos e fragrâncias artificiais. Rende até 3x mais que o líquido.",
          price: 34.90,
          stock: 30,
          weight: 100,
          dimensions: "6x6x3 cm",
          category_id: "c4",
          images: [
            "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=600&auto=format&fit=crop&q=80"
          ],
          featured: false
        }
      ];
      localStorage.setItem("ong_products", JSON.stringify(seedProducts));
      setProducts(seedProducts);
    }

    // 3. Animals
    const localAnimals = localStorage.getItem("ong_animals");
    if (localAnimals) {
      setAnimals(JSON.parse(localAnimals));
    } else {
      const seedAnimals: Animal[] = [
        {
          id: "a1",
          name: "Pipoca",
          species: "dog",
          breed: "Vira-lata (SRD)",
          age: "8 meses (Filhote)",
          size: "medium",
          temperament: "Amigável, brincalhão, muito enérgico e adora crianças.",
          history: "Encontrada abandonada em uma caixa perto de um parque quando tinha apenas 1 mês de vida. Passou por cuidados médicos, foi vermifugada e hoje está cheia de saúde e alegria esperando um lar.",
          health_status: ["Vacinado", "Castrado", "Vermifugado"],
          images: [
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"
          ],
          featured: true,
          status: "available"
        },
        {
          id: "a2",
          name: "Mel",
          species: "cat",
          breed: "Siamês Mestiço",
          age: "2 anos (Adulto)",
          size: "small",
          temperament: "Calma, independente, carinhosa no tempo dela e adora um colo quentinho.",
          history: "Resgatada de maus-tratos em uma casa desocupada. Era arisca no início, mas com muito amor e paciência de nossos voluntários se transformou em uma gatinha doce e companheira.",
          health_status: ["Vacinado", "Castrado"],
          images: [
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80"
          ],
          featured: true,
          status: "available"
        },
        {
          id: "a3",
          name: "Apolo",
          species: "dog",
          breed: "Vira-lata (SRD)",
          age: "6 anos (Adulto)",
          size: "large",
          temperament: "Protetor, calmo, obediente e excelente companheiro para caminhadas.",
          history: "Resgatado de um atropelamento em rodovia. Passou por cirurgia ortopédica bem-sucedida. Recuperou-se totalmente e está pronto para ganhar uma nova chance.",
          health_status: ["Vacinado", "Castrado", "Vermifugado"],
          images: [
            "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&auto=format&fit=crop&q=80"
          ],
          featured: false,
          status: "available"
        },
        {
          id: "a4",
          name: "Bolinha",
          species: "cat",
          breed: "Persa Mestiço",
          age: "9 anos (Idoso)",
          size: "medium",
          temperament: "Dócil, dorminhoco, silencioso e muito companheiro.",
          history: "Sua tutora idosa faleceu e a família não pôde mantê-lo. É um gatinho idoso, muito tranquilo, que precisa de um ambiente calmo para viver seus anos dourados.",
          health_status: ["Vacinado", "Castrado"],
          special_needs: "Precisa de escovação diária dos pelos e alimentação especial para trato urinário.",
          images: [
            "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80"
          ],
          featured: true,
          status: "available"
        }
      ];
      localStorage.setItem("ong_animals", JSON.stringify(seedAnimals));
      setAnimals(seedAnimals);
    }

    // 4. Articles
    const localArticles = localStorage.getItem("ong_articles");
    if (localArticles) {
      setArticles(JSON.parse(localArticles));
    } else {
      const seedArticles: Article[] = [
        {
          id: "art1",
          title: "Como preparar a sua casa para a chegada de um pet adotado",
          excerpt: "Adotar um cão ou gatinho é um momento mágico, mas exige adaptações importantes no ambiente para a segurança de todos.",
          content: "Adotar um animal de estimação traz imensa alegria, mas antes de abrir a porta para o seu novo amigo, certifique-se de que sua casa está segura e aconchegante. Primeiramente, instale redes de proteção em janelas e sacadas se estiver adotando um gato. Para cães, verifique se portões e frestas não oferecem risco de fuga. Crie um espaço especial com caminha confortável, comedouro e bebedouro limpos, além de brinquedos seguros. Lembre-se de esconder fios elétricos e retirar plantas tóxicas do alcance deles. A transição pode levar alguns dias, então dê espaço para que ele explore o novo lar no próprio tempo, oferecendo muito carinho e paciência.",
          image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80",
          author: "Dra. Carolina Castro (Veterinária)",
          slug: "preparar-casa-pet-adotado",
          created_at: new Date().toISOString()
        },
        {
          id: "art2",
          title: "A importância da castração precoce e os mitos comuns",
          excerpt: "Muito além do controle populacional de animais abandonados, a castração previne doenças graves e melhora o comportamento.",
          content: "A castração é um ato de amor e responsabilidade. Ao contrário do que dizem os mitos, os animais não ficam tristes ou 'incompletos' por serem castrados. O procedimento previne infecções uterinas graves e tumores de mama em fêmeas, e tumores de próstata em machos. Além disso, diminui drasticamente comportamentos indesejados como marcação de território com urina, fugas e brigas na rua. A cirurgia é simples, de rápida recuperação e realizada de forma segura sob anestesia geral por veterinários capacitados. Castre e proteja quem você ama!",
          image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80",
          author: "Rodrigo Almeida (Fundador)",
          slug: "importancia-da-castracao-pet",
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem("ong_articles", JSON.stringify(seedArticles));
      setArticles(seedArticles);
    }

    // 5. Orders, Donations, AdoptionRequests, Sponsors, Users
    setOrders(JSON.parse(localStorage.getItem("ong_orders") || "[]"));
    setAdoptionRequests(JSON.parse(localStorage.getItem("ong_adoption_requests") || "[]"));
    setSponsors(JSON.parse(localStorage.getItem("ong_sponsors") || "[]"));

    const storedDonations = localStorage.getItem("ong_donations");
    if (storedDonations) {
      setDonations(JSON.parse(storedDonations));
    } else {
      // Seed some starting transparency donations
      const seedDonations: Donation[] = [
        { id: "d1", user_name: "Mariana Silva", type: "one_time", amount: 50.00, status: "paid", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: "d2", user_name: "Bruno Costa", type: "recurring", amount: 30.00, status: "paid", frequency: "monthly", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: "d3", user_name: "Ana Nogueira", type: "one_time", amount: 150.00, status: "paid", created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
      ];
      localStorage.setItem("ong_donations", JSON.stringify(seedDonations));
      setDonations(seedDonations);
    }

    // Auth sync
    const activeUser = localStorage.getItem("ong_active_user");
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  // Helper to persist states
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Auth Operations
  const login = (email: string, role: "client" | "admin" = "client") => {
    const formattedEmail = email.toLowerCase().trim();
    let name = "Usuário Teste";
    let selectedRole = role;

    // Check pre-defined credentials
    if (formattedEmail === "admin@patas.org") {
      name = "Presidente ONG";
      selectedRole = "admin";
    } else if (formattedEmail.includes("admin")) {
      name = "Moderador Patas";
      selectedRole = "admin";
    } else {
      name = formattedEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ");
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    const loggedUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name: name,
      email: formattedEmail,
      role: selectedRole,
      phone: "(11) 99999-8888",
      address: {
        street: "Rua dos Pets, 123",
        city: "São Paulo",
        state: "SP",
        zip: "01311-000"
      }
    };
    setCurrentUser(loggedUser);
    localStorage.setItem("ong_active_user", JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ong_active_user");
    setCart([]);
    setCoupon(null);
    setShippingCost(null);
  };

  const registerUser = (name: string, email: string, phone?: string) => {
    const newUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase().trim(),
      role: "client",
      phone: phone || "(11) 99999-7777",
      address: {
        street: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zip: "01310-100"
      }
    };
    setCurrentUser(newUser);
    localStorage.setItem("ong_active_user", JSON.stringify(newUser));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      return updated;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setShippingCost(null);
  };

  // Checkout operations
  const applyCoupon = (code: string) => {
    const normalized = code.toUpperCase().trim();
    if (normalized === "PATAS10" || normalized === "NUBANK" || normalized === "PETLOVE") {
      setCoupon({ code: normalized, discount: 0.10 }); // 10%
      return true;
    } else if (normalized === "SUPERONG") {
      setCoupon({ code: normalized, discount: 0.20 }); // 20%
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const calculateShipping = (zip: string) => {
    // Basic simulation
    const cost = Math.max(10.00, Math.floor(Math.random() * 25) + 5.90);
    setShippingCost(cost);
    return cost;
  };

  const checkout = (paymentMethod: "pix" | "card" | "boleto", address: any) => {
    // Math total
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountVal = coupon ? subtotal * coupon.discount : 0;
    const shipVal = shippingCost || 0;
    const finalTotal = parseFloat((subtotal - discountVal + shipVal).toFixed(2));

    const newOrder: Order = {
      id: "ped_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      user_id: currentUser?.id || "anonymous",
      user_email: currentUser?.email || "anonimo@patas.org",
      status: "paid", // Auto-approved for simulation
      total: finalTotal,
      coupon_code: coupon?.code,
      shipping_address: address,
      shipping_cost: shipVal,
      payment_method: paymentMethod,
      items: cart.map((item) => ({
        id: "item_" + Math.random().toString(36).substr(2, 9),
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      created_at: new Date().toISOString(),
    };

    // Update orders state
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveToStorage("ong_orders", updatedOrders);

    // Decrement stock
    const updatedProducts = products.map((prod) => {
      const cartMatch = cart.find((c) => c.product.id === prod.id);
      if (cartMatch) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartMatch.quantity),
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    saveToStorage("ong_products", updatedProducts);

    // Clean cart
    clearCart();

    return newOrder;
  };

  // Donations & Sponsorships
  const makeDonation = (amount: number, type: "one_time" | "recurring", frequency?: "monthly" | "quarterly" | "yearly", animalId?: string) => {
    const newDonation: Donation = {
      id: "don_" + Math.random().toString(36).substr(2, 9),
      user_id: currentUser?.id,
      user_name: currentUser?.name || "Doador Anônimo",
      type,
      amount,
      status: "paid",
      frequency,
      animal_id: animalId,
      created_at: new Date().toISOString(),
    };

    const updatedDonations = [newDonation, ...donations];
    setDonations(updatedDonations);
    saveToStorage("ong_donations", updatedDonations);

    // If it's a pet sponsorship (padrinho)
    if (animalId) {
      const animal = animals.find((a) => a.id === animalId);
      const newSponsor: Sponsor = {
        id: "pad_" + Math.random().toString(36).substr(2, 9),
        user_id: currentUser?.id || "anon",
        user_name: currentUser?.name || "Padrinho Anônimo",
        animal_id: animalId,
        animal_name: animal?.name || "Pet Apoiado",
        monthly_amount: amount,
        status: "active",
        start_date: new Date().toISOString(),
      };
      const updatedSponsors = [newSponsor, ...sponsors];
      setSponsors(updatedSponsors);
      saveToStorage("ong_sponsors", updatedSponsors);
    }
  };

  // Adoption Requests
  const submitAdoptionRequest = (animalId: string, answers: any) => {
    const animal = animals.find((a) => a.id === animalId);
    
    // Update animal status to pending
    const updatedAnimals = animals.map((a) =>
      a.id === animalId ? { ...a, status: "pending" as const } : a
    );
    setAnimals(updatedAnimals);
    saveToStorage("ong_animals", updatedAnimals);

    const newRequest: AdoptionRequest = {
      id: "sol_" + Math.random().toString(36).substr(2, 9),
      user_id: currentUser?.id || "anon_user",
      user_name: currentUser?.name || answers.fullName,
      user_email: currentUser?.email || "solicitante@email.com",
      animal_id: animalId,
      animal_name: animal?.name || "Animal",
      status: "pending",
      answers,
      created_at: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...adoptionRequests];
    setAdoptionRequests(updatedRequests);
    saveToStorage("ong_adoption_requests", updatedRequests);
  };

  // Admin Controls
  const createProduct = (product: Omit<Product, "id">) => {
    const newProd: Product = {
      ...product,
      id: "p_" + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    saveToStorage("ong_products", updated);
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    saveToStorage("ong_products", updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveToStorage("ong_products", updated);
  };

  const createAnimal = (animal: Omit<Animal, "id" | "status">) => {
    const newAnimal: Animal = {
      ...animal,
      id: "a_" + Math.random().toString(36).substr(2, 9),
      status: "available",
    };
    const updated = [newAnimal, ...animals];
    setAnimals(updated);
    saveToStorage("ong_animals", updated);
  };

  const updateAnimal = (updatedAnimal: Animal) => {
    const updated = animals.map((a) => a.id === updatedAnimal.id ? updatedAnimal : a);
    setAnimals(updated);
    saveToStorage("ong_animals", updated);
  };

  const deleteAnimal = (id: string) => {
    const updated = animals.filter((a) => a.id !== id);
    setAnimals(updated);
    saveToStorage("ong_animals", updated);
  };

  const updateAdoptionRequestStatus = (id: string, status: "pending" | "interview" | "approved" | "rejected") => {
    const request = adoptionRequests.find((r) => r.id === id);
    if (!request) return;

    // Update request status
    const updatedRequests = adoptionRequests.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setAdoptionRequests(updatedRequests);
    saveToStorage("ong_adoption_requests", updatedRequests);

    // If approved, update animal status to 'adopted'
    if (status === "approved") {
      const updatedAnimals = animals.map((a) =>
        a.id === request.animal_id ? { ...a, status: "adopted" as const } : a
      );
      setAnimals(updatedAnimals);
      saveToStorage("ong_animals", updatedAnimals);
    } else if (status === "rejected") {
      // Return animal status to 'available'
      const updatedAnimals = animals.map((a) =>
        a.id === request.animal_id ? { ...a, status: "available" as const } : a
      );
      setAnimals(updatedAnimals);
      saveToStorage("ong_animals", updatedAnimals);
    }
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveToStorage("ong_orders", updated);
  };

  const createArticle = (article: Omit<Article, "id" | "created_at" | "slug">) => {
    const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newArt: Article = {
      ...article,
      id: "art_" + Math.random().toString(36).substr(2, 9),
      slug,
      created_at: new Date().toISOString()
    };
    const updated = [newArt, ...articles];
    setArticles(updated);
    saveToStorage("ong_articles", updated);
  };

  const updateArticle = (updatedArticle: Article) => {
    const slug = updatedArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const updated = articles.map((a) =>
      a.id === updatedArticle.id ? { ...updatedArticle, slug } : a
    );
    setArticles(updated);
    saveToStorage("ong_articles", updated);
  };

  const deleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    saveToStorage("ong_articles", updated);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        categories,
        products,
        animals,
        orders,
        donations,
        sponsors,
        adoptionRequests,
        articles,
        cart,
        coupon,
        shippingCost,
        login,
        logout,
        registerUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        calculateShipping,
        checkout,
        makeDonation,
        submitAdoptionRequest,
        createProduct,
        updateProduct,
        deleteProduct,
        createAnimal,
        updateAnimal,
        deleteAnimal,
        updateAdoptionRequestStatus,
        updateOrderStatus,
        createArticle,
        updateArticle,
        deleteArticle
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
