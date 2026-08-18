CREATE TABLE IF NOT EXISTS inventaris (
	id SERIAL PRIMARY KEY,
	nama_barang VARCHAR(100) NOT NULL,
	stok int DEFAULT 0,
	harga DECIMAL(10, 2),
	kategori varchar(50)
);

CREATE TABLE IF NOT EXISTS transaksi (
    id SERIAL PRIMARY KEY,
    barang_id INTEGER,
    tipe_transaksi VARCHAR(10) CHECK (tipe_transaksi IN ('MASUK', 'KELUAR')),
    jumlah INTEGER NOT NULL,
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--ALTER TABLE transaksi DROP CONSTRAINT transaksi_barang_id_fkey;

ALTER TABLE inventaris ADD CONSTRAINT unique_nama_barang UNIQUE (nama_barang);

ALTER TABLE inventaris DROP CONSTRAINT unique_nama_barang;

CREATE UNIQUE INDEX unique_nama_barang_case_insensitive ON inventaris (LOWER(nama_barang));

ALTER TABLE inventaris ADD CONSTRAINT chk_stok_tidak_minus CHECK (stok >= 0);

--TRIGGER UNTUK BARANG MASUK
CREATE OR REPLACE FUNCTION catat_transaksi_masuk()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
	VALUES (NEW.id, 'MASUK', NEW.stok);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER otomatis_catat_masuk
AFTER INSERT ON inventaris
FOR EACH ROW
EXECUTE FUNCTION catat_transaksi_masuk();

--TRIGGER UNTUK BARANG KELUAR
CREATE OR REPLACE FUNCTION catat_transaksi_dihapus()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
	VALUES (OLD.id, 'KELUAR', OLD.stok);
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER otomatis_catat_hapus
AFTER DELETE ON inventaris
FOR EACH ROW
EXECUTE FUNCTION catat_transaksi_dihapus();

--TRIGGER UNTUK UPDATE
CREATE OR REPLACE FUNCTION catat_transaksi_update()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER otomatis_catat_update
AFTER UPDATE ON inventaris
FOR EACH ROW
EXECUTE FUNCTION catat_transaksi_update();

SELECT * FROM inventaris order by ID ASC;

SELECT * FROM transaksi order by ID ASC;

--TRUNCATE TABLE transaksi RESTART IDENTITY;
--
--TRUNCATE TABLE inventaris RESTART IDENTITY;

--DELETE FROM inventaris WHERE id = 1;