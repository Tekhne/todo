SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: account_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.account_status AS ENUM (
    'active'
);


--
-- Name: token_credential_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.token_credential_type AS ENUM (
    'email_confirmation'
);


--
-- Name: username_credential_password_digest_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.username_credential_password_digest_type AS ENUM (
    'bcrypt'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status public.account_status DEFAULT 'active'::public.account_status NOT NULL
);


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: email_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_addresses (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    email character varying(254) NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: email_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_addresses_id_seq OWNED BY public.email_addresses.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: todo_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.todo_items (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: todo_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.todo_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: todo_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.todo_items_id_seq OWNED BY public.todo_items.id;


--
-- Name: token_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_credentials (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    expiration timestamp without time zone NOT NULL,
    token character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    token_type public.token_credential_type NOT NULL
);


--
-- Name: token_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.token_credentials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: token_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.token_credentials_id_seq OWNED BY public.token_credentials.id;


--
-- Name: username_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.username_credentials (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    password_digest character varying NOT NULL,
    username character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    password_digest_type public.username_credential_password_digest_type DEFAULT 'bcrypt'::public.username_credential_password_digest_type NOT NULL
);


--
-- Name: username_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.username_credentials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: username_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.username_credentials_id_seq OWNED BY public.username_credentials.id;


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: email_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_addresses ALTER COLUMN id SET DEFAULT nextval('public.email_addresses_id_seq'::regclass);


--
-- Name: todo_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todo_items ALTER COLUMN id SET DEFAULT nextval('public.todo_items_id_seq'::regclass);


--
-- Name: token_credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_credentials ALTER COLUMN id SET DEFAULT nextval('public.token_credentials_id_seq'::regclass);


--
-- Name: username_credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.username_credentials ALTER COLUMN id SET DEFAULT nextval('public.username_credentials_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: email_addresses email_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_addresses
    ADD CONSTRAINT email_addresses_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: todo_items todo_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todo_items
    ADD CONSTRAINT todo_items_pkey PRIMARY KEY (id);


--
-- Name: token_credentials token_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_credentials
    ADD CONSTRAINT token_credentials_pkey PRIMARY KEY (id);


--
-- Name: username_credentials username_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.username_credentials
    ADD CONSTRAINT username_credentials_pkey PRIMARY KEY (id);


--
-- Name: index_accounts_on_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_accounts_on_status ON public.accounts USING btree (status);


--
-- Name: index_email_addresses_on_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_email_addresses_on_account_id ON public.email_addresses USING btree (account_id);


--
-- Name: index_email_addresses_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_email_addresses_on_email ON public.email_addresses USING btree (email);


--
-- Name: index_todo_items_on_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_todo_items_on_account_id ON public.todo_items USING btree (account_id);


--
-- Name: index_token_credentials_on_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_token_credentials_on_account_id ON public.token_credentials USING btree (account_id);


--
-- Name: index_token_credentials_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_token_credentials_on_token ON public.token_credentials USING btree (token);


--
-- Name: index_token_credentials_on_token_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_token_credentials_on_token_type ON public.token_credentials USING btree (token_type);


--
-- Name: index_username_credentials_on_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_username_credentials_on_account_id ON public.username_credentials USING btree (account_id);


--
-- Name: index_username_credentials_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_username_credentials_on_username ON public.username_credentials USING btree (username);


--
-- Name: username_credentials fk_rails_3c4665b205; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.username_credentials
    ADD CONSTRAINT fk_rails_3c4665b205 FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: token_credentials fk_rails_4711eb112b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_credentials
    ADD CONSTRAINT fk_rails_4711eb112b FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: todo_items fk_rails_9a71ffdf5d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.todo_items
    ADD CONSTRAINT fk_rails_9a71ffdf5d FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: email_addresses fk_rails_b5f765e7ff; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_addresses
    ADD CONSTRAINT fk_rails_b5f765e7ff FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20190426205855'),
('20190428144541'),
('20190429162136'),
('20190429170737'),
('20190429184734'),
('20190430193519'),
('20190607201532');


