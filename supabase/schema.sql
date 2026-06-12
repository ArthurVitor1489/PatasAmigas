-- SQL Schema para Supabase / PostgreSQL
-- Banco de Dados da ONG Patas Amigas

-- Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS (Perfis extras vinculados ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin', 'moderator')),
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    weight DECIMAL(8, 2), -- em gramas/kg
    dimensions VARCHAR(100), -- "10x20x30 cm"
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCT_IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    shipping_address JSONB NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    tracking_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDER_ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('pix', 'card', 'boleto')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
    transaction_id VARCHAR(255),
    payload JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. DONATIONS
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('one_time', 'recurring')),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    frequency VARCHAR(50) CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. ANIMALS
CREATE TABLE IF NOT EXISTS public.animals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat')),
    breed VARCHAR(100) DEFAULT 'SRD',
    age VARCHAR(100), -- Ex: "2 meses", "3 anos"
    size VARCHAR(50) CHECK (size IN ('small', 'medium', 'large')),
    temperament VARCHAR(255), -- Ex: "Dócil, Brincalhão, Ativo"
    history TEXT,
    health_status VARCHAR(100)[] DEFAULT '{}', -- Ex: {'vaccinated', 'castrated', 'dewormed'}
    special_needs TEXT,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ANIMAL_IMAGES
CREATE TABLE IF NOT EXISTS public.animal_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. SPONSORS (Programa de padrinhos)
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
    monthly_amount DECIMAL(10, 2) NOT NULL CHECK (monthly_amount > 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. SPONSOR_PAYMENTS
CREATE TABLE IF NOT EXISTS public.sponsor_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_status VARCHAR(50) DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. ADOPTION_REQUESTS
CREATE TABLE IF NOT EXISTS public.adoption_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'interview', 'approved', 'rejected')),
    answers JSONB NOT NULL, -- Respostas do questionário de adoção
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. REVIEWS (Avaliações de produtos)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------------------------------
-- Row Level Security (RLS) e Políticas de Segurança do Supabase
-------------------------------------------------------------------------------

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
CREATE POLICY "Leitura pública de categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública de produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Leitura pública de imagens de produtos" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Leitura pública de animais" ON public.animals FOR SELECT USING (true);
CREATE POLICY "Leitura pública de imagens de animais" ON public.animal_images FOR SELECT USING (true);
CREATE POLICY "Leitura pública de cupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Leitura pública de reviews" ON public.reviews FOR SELECT USING (true);

-- Políticas de Usuário
CREATE POLICY "Usuários veem seus próprios perfis" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários veem seus próprios pedidos" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários criam seus próprios pedidos" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários veem seus itens de pedidos" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Usuários veem suas doações" ON public.donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários criam suas doações" ON public.donations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários veem seus apadrinhamentos" ON public.sponsors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários veem suas solicitações de adoção" ON public.adoption_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários criam suas solicitações de adoção" ON public.adoption_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função de Checagem de Administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de Admin
CREATE POLICY "Admins têm controle total sobre produtos" ON public.products ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins têm controle total sobre animais" ON public.animals ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins gerenciam adoções" ON public.adoption_requests ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins gerenciam pedidos" ON public.orders ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins gerenciam doações" ON public.donations ALL TO authenticated USING (public.is_admin());

-------------------------------------------------------------------------------
-- Triggers e Funções Auxiliares (Ex: Controle de Estoque Automático)
-------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_stock_on_payment()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
