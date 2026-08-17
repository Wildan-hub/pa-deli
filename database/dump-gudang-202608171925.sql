--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-08-17 19:25:06

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

--
-- TOC entry 224 (class 1255 OID 17187)
-- Name: catat_transaksi_dihapus(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.catat_transaksi_dihapus() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
	VALUES (OLD.id, 'KELUAR', OLD.stok);
	RETURN OLD;
END;
$$;


ALTER FUNCTION public.catat_transaksi_dihapus() OWNER TO postgres;

--
-- TOC entry 223 (class 1255 OID 17185)
-- Name: catat_transaksi_masuk(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.catat_transaksi_masuk() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
	VALUES (NEW.id, 'MASUK', NEW.stok);
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.catat_transaksi_masuk() OWNER TO postgres;

--
-- TOC entry 225 (class 1255 OID 17189)
-- Name: catat_transaksi_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.catat_transaksi_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF NEW.stok > OLD.stok THEN
		INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
		VALUES (NEW.id, 'MASUK', NEW.stok - OLD.stok);

	ELSEIF NEW.stok < OLD.stok THEN
		INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
		VALUES (NEW.id, 'KELUAR', OLD.stok - NEW.stok);
	END IF;
	
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.catat_transaksi_update() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 17161)
-- Name: inventaris; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventaris (
    id integer NOT NULL,
    nama_barang character varying(100) NOT NULL,
    stok integer DEFAULT 0,
    harga numeric(10,2),
    kategori character varying(50),
    CONSTRAINT chk_stok_tidak_minus CHECK ((stok >= 0))
);


ALTER TABLE public.inventaris OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17160)
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
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 219
-- Name: inventaris_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventaris_id_seq OWNED BY public.inventaris.id;


--
-- TOC entry 222 (class 1259 OID 17171)
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
-- TOC entry 221 (class 1259 OID 17170)
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
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 221
-- Name: transaksi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaksi_id_seq OWNED BY public.transaksi.id;


--
-- TOC entry 4864 (class 2604 OID 17164)
-- Name: inventaris id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventaris ALTER COLUMN id SET DEFAULT nextval('public.inventaris_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 17174)
-- Name: transaksi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi ALTER COLUMN id SET DEFAULT nextval('public.transaksi_id_seq'::regclass);


--
-- TOC entry 5026 (class 0 OID 17161)
-- Dependencies: 220
-- Data for Name: inventaris; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventaris (id, nama_barang, stok, harga, kategori) FROM stdin;
\.


--
-- TOC entry 5028 (class 0 OID 17171)
-- Dependencies: 222
-- Data for Name: transaksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaksi (id, barang_id, tipe_transaksi, jumlah, tanggal) FROM stdin;
\.


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 219
-- Name: inventaris_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventaris_id_seq', 1, false);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 221
-- Name: transaksi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaksi_id_seq', 1, false);


--
-- TOC entry 4871 (class 2606 OID 17169)
-- Name: inventaris inventaris_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventaris
    ADD CONSTRAINT inventaris_pkey PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2606 OID 17180)
-- Name: transaksi transaksi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi
    ADD CONSTRAINT transaksi_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 1259 OID 17183)
-- Name: unique_nama_barang_case_insensitive; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_nama_barang_case_insensitive ON public.inventaris USING btree (lower((nama_barang)::text));


--
-- TOC entry 4875 (class 2620 OID 17188)
-- Name: inventaris otomatis_catat_hapus; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER otomatis_catat_hapus AFTER DELETE ON public.inventaris FOR EACH ROW EXECUTE FUNCTION public.catat_transaksi_dihapus();


--
-- TOC entry 4876 (class 2620 OID 17186)
-- Name: inventaris otomatis_catat_masuk; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER otomatis_catat_masuk AFTER INSERT ON public.inventaris FOR EACH ROW EXECUTE FUNCTION public.catat_transaksi_masuk();


--
-- TOC entry 4877 (class 2620 OID 17190)
-- Name: inventaris otomatis_catat_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER otomatis_catat_update AFTER UPDATE ON public.inventaris FOR EACH ROW EXECUTE FUNCTION public.catat_transaksi_update();


-- Completed on 2026-08-17 19:25:07

--
-- PostgreSQL database dump complete
--


