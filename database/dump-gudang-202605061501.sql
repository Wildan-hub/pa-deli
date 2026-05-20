--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-20 09:19:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16846)
-- Name: inventaris; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventaris (
    id integer NOT NULL,
    nama_barang character varying(100) NOT NULL,
    stok integer DEFAULT 0,
    harga numeric(10,2),
    kategori character varying(50)
);


ALTER TABLE public.inventaris OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16845)
-- Name: inventaris_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventaris_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventaris_id_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 219
-- Name: inventaris_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventaris_id_seq OWNED BY public.inventaris.id;


--
-- TOC entry 222 (class 1259 OID 16860)
-- Name: transaksi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaksi (
    id integer NOT NULL,
    barang_id integer,
    tipe_transaksi character varying(10),
    jumlah integer NOT NULL,
    tanggal timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transaksi_tipe_transaksi_check CHECK (((tipe_transaksi)::text = ANY ((ARRAY['MASUK'::character varying, 'KELUAR'::character varying])::text[])))
);


ALTER TABLE public.transaksi OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16859)
-- Name: transaksi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaksi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaksi_id_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: transaksi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaksi_id_seq OWNED BY public.transaksi.id;


--
-- TOC entry 4861 (class 2604 OID 16849)
-- Name: inventaris id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventaris ALTER COLUMN id SET DEFAULT nextval('public.inventaris_id_seq'::regclass);


--
-- TOC entry 4863 (class 2604 OID 16863)
-- Name: transaksi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi ALTER COLUMN id SET DEFAULT nextval('public.transaksi_id_seq'::regclass);


--
-- TOC entry 5019 (class 0 OID 16846)
-- Dependencies: 220
-- Data for Name: inventaris; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventaris (id, nama_barang, stok, harga, kategori) FROM stdin;
8	apple watch	100	10000.00	perkakas
11	gelas	487	500000.00	peralatan
13	Tv	110	504000.00	peralatan
1	Laptop	5	8000000.00	Elektronik
2	Mouse	5	300000.00	Elektronik
3	Keyboard	3	500000.00	Elektronik
4	Monitor	10	1000000.00	Elektronik
16	tumbler	73	190000.00	kebutuhan
17	pc	43	230000.00	kebutuhan
18	kabel	73	235700.00	elektronik
32	Hardisk	4	250000.00	Elektronik
36	PlayStation	3	123456.00	kebutuhan
\.


--
-- TOC entry 5021 (class 0 OID 16860)
-- Dependencies: 222
-- Data for Name: transaksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaksi (id, barang_id, tipe_transaksi, jumlah, tanggal) FROM stdin;
1	1	MASUK	5	2026-05-05 10:56:40.884664
2	2	KELUAR	2	2026-05-05 10:56:40.884664
\.


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 219
-- Name: inventaris_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventaris_id_seq', 39, true);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 221
-- Name: transaksi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaksi_id_seq', 10, true);


--
-- TOC entry 4867 (class 2606 OID 16854)
-- Name: inventaris inventaris_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventaris
    ADD CONSTRAINT inventaris_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16869)
-- Name: transaksi transaksi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi
    ADD CONSTRAINT transaksi_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 16870)
-- Name: transaksi transaksi_barang_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi
    ADD CONSTRAINT transaksi_barang_id_fkey FOREIGN KEY (barang_id) REFERENCES public.inventaris(id) ON DELETE CASCADE;


-- Completed on 2026-05-20 09:19:49

--
-- PostgreSQL database dump complete
--


