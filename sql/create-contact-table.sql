CREATE TABLE "contact" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "phone" character varying,
    "email" character varying,
    "link_precedence" character varying NOT NULL,
    "linked_id" integer REFERENCES contact(id) ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "deleted_at" TIMESTAMP
);
