-- Databases for each architecture pattern family (one DB per bounded-context owner).
\set ON_ERROR_STOP on

CREATE DATABASE arch_monolithic;
CREATE DATABASE arch_mmm_user;
CREATE DATABASE arch_mmm_order;
CREATE DATABASE arch_dist;
CREATE DATABASE arch_ms_user;
CREATE DATABASE arch_ms_order;
CREATE DATABASE arch_eda_order;
CREATE DATABASE arch_eda_user;
CREATE DATABASE arch_cn_user;
CREATE DATABASE arch_cn_order;
CREATE DATABASE arch_erp;
