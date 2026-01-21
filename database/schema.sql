CREATE DATABASE `assignment_point` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */

create table revenue_rules
(
    id                     bigint auto_increment
        primary key,
    created_at             datetime(6)          null,
    updated_at             datetime(6)          null,
    editor_percentage      decimal(38, 2)       null,
    is_active              tinyint(1) default 1 null,
    is_returning_customer  bit                  not null,
    manager_percentage     decimal(38, 2)       null,
    profit_percentage      decimal(38, 2)       not null,
    rule_name              varchar(255)         not null,
    sales_agent_percentage decimal(38, 2)       null,
    writer_percentage      decimal(38, 2)       not null,
    constraint UK_4ok1mpxokywj8kpotjd6quk27
        unique (rule_name)
);

create table users
(
    id                bigint auto_increment
        primary key,
    email             varchar(255)                                                       not null,
    password          varchar(255)                                                       not null,
    first_name        varchar(100)                                                       not null,
    last_name         varchar(100)                                                       not null,
    phone             varchar(20)                                                        null,
    role              enum ('ADMIN', 'WRITER', 'CUSTOMER', 'SALES_AGENT', 'EDITOR')      not null,
    status            enum ('ACTIVE', 'INACTIVE', 'SUSPENDED') default 'ACTIVE'          null,
    created_at        timestamp                                default CURRENT_TIMESTAMP null,
    updated_at        timestamp                                default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    is_active         tinyint(1)                               default 1                 null,
    is_email_verified tinyint(1)                               default 0                 null,
    last_login_at     datetime(6)                                                        null,
    profile_image_url varchar(255)                                                       null,
    constraint email
        unique (email)
);

create table notifications
(
    id         bigint auto_increment
        primary key,
    user_id    bigint                               not null,
    title      varchar(255)                         not null,
    message    text                                 not null,
    type       varchar(50)                          null,
    is_read    tinyint(1) default 0                 null,
    created_at timestamp  default CURRENT_TIMESTAMP null,
    constraint notifications_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create index idx_read
    on notifications (is_read);

create index idx_user
    on notifications (user_id);

create table sales_agents
(
    id               bigint auto_increment
        primary key,
    user_id          bigint                       not null,
    commission_rate  decimal(5, 2)  default 10.00 null,
    total_sales      decimal(10, 2) default 0.00  null,
    total_commission decimal(10, 2) default 0.00  null,
    created_at       datetime(6)                  null,
    updated_at       datetime(6)                  null,
    active_customers int                          null,
    referral_code    varchar(255)                 not null,
    total_referrals  int                          null,
    wallet_balance   decimal(38, 2)               null,
    constraint UK_rs9ywhs5ctprb7tvq7kjsrj20
        unique (referral_code),
    constraint user_id
        unique (user_id),
    constraint sales_agents_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create table customers
(
    id                 bigint auto_increment
        primary key,
    user_id            bigint                      not null,
    referral_code      varchar(50)                 null,
    total_spent        decimal(38, 2)              null,
    created_at         datetime(6)                 null,
    updated_at         datetime(6)                 null,
    is_returning       tinyint(1)     default 0    null,
    referral_code_used varchar(255)                null,
    total_orders       int                         null,
    sales_agent_id     bigint                      null,
    wallet_balance     decimal(10, 2) default 0.00 null,
    total_deposited    decimal(10, 2) default 0.00 null,
    last_deposit_date  datetime                    null,
    constraint user_id
        unique (user_id),
    constraint FKnn8u2i51wstolm6g1b4llu4s6
        foreign key (sales_agent_id) references sales_agents (id),
    constraint customers_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create table payments
(
    id                       bigint auto_increment
        primary key,
    customer_id              bigint                                                                                     not null,
    payment_method           enum ('STRIPE', 'PAYPAL')                                                                  not null,
    payment_type             enum ('CARD', 'BANK_TRANSFER', 'PAYPAL_WALLET')                                            not null,
    amount                   decimal(10, 2)                                                                             not null,
    status                   enum ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') default 'PENDING'         null,
    stripe_payment_intent_id varchar(100)                                                                               null,
    stripe_charge_id         varchar(100)                                                                               null,
    paypal_transaction_id    varchar(100)                                                                               null,
    paypal_order_id          varchar(100)                                                                               null,
    description              varchar(255)                                                                               null,
    error_message            varchar(500)                                                                               null,
    created_at               datetime                                                         default CURRENT_TIMESTAMP null,
    updated_at               datetime                                                         default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint uk_paypal_order
        unique (paypal_order_id),
    constraint uk_stripe_intent
        unique (stripe_payment_intent_id),
    constraint payments_ibfk_1
        foreign key (customer_id) references customers (id)
            on delete cascade
);

create table payment_logs
(
    id         bigint auto_increment
        primary key,
    payment_id bigint                                                                 not null,
    log_type   enum ('INFO', 'SUCCESS', 'ERROR', 'WEBHOOK') default 'INFO'            null,
    message    varchar(500)                                                           null,
    metadata   json                                                                   null,
    created_at datetime                                     default CURRENT_TIMESTAMP null,
    constraint payment_logs_ibfk_1
        foreign key (payment_id) references payments (id)
            on delete cascade
);

create index idx_created_at
    on payment_logs (created_at);

create index idx_payment_id
    on payment_logs (payment_id);

create index idx_created_at
    on payments (created_at);

create index idx_customer_id
    on payments (customer_id);

create index idx_payment_method_status
    on payments (payment_method, status);

create index idx_status
    on payments (status);

create index idx_email
    on users (email);

create index idx_role
    on users (role);

create table wallet_transactions
(
    id               bigint auto_increment
        primary key,
    customer_id      bigint                                                                         not null,
    transaction_type enum ('DEPOSIT', 'WITHDRAWAL', 'REFUND', 'ORDER_CREATION', 'ORDER_COMPLETION') not null,
    amount           decimal(10, 2)                                                                 not null,
    balance_before   decimal(10, 2)                                                                 not null,
    balance_after    decimal(10, 2)                                                                 not null,
    description      varchar(255)                                                                   null,
    reference_id     varchar(100)                                                                   null,
    created_at       datetime default CURRENT_TIMESTAMP                                             null,
    updated_at       datetime default CURRENT_TIMESTAMP                                             null on update CURRENT_TIMESTAMP,
    constraint wallet_transactions_ibfk_1
        foreign key (customer_id) references customers (id)
            on delete cascade
);

create index idx_created_at
    on wallet_transactions (created_at);

create index idx_customer_id
    on wallet_transactions (customer_id);

create index idx_wallet_customer_type
    on wallet_transactions (customer_id, transaction_type);

create table writers
(
    id                     bigint auto_increment
        primary key,
    user_id                bigint                      not null,
    expertise              text                        null,
    rating                 decimal(38, 2)              null,
    total_orders           int            default 0    null,
    completed_orders       int            default 0    null,
    balance                decimal(10, 2) default 0.00 null,
    created_at             datetime(6)                 null,
    updated_at             datetime(6)                 null,
    availability_status    varchar(255)                null,
    specializations        text                        null,
    success_rate           decimal(38, 2)              null,
    total_orders_completed int                         null,
    wallet_balance         decimal(38, 2)              null,
    writer_manager_id      bigint                      null,
    constraint user_id
        unique (user_id),
    constraint FK6nx5jd5y4yal4q09mjqa6vas9
        foreign key (writer_manager_id) references users (id),
    constraint writers_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create table orders
(
    id                    bigint auto_increment
        primary key,
    order_number          varchar(50)                                                                                                                          not null,
    customer_id           bigint                                                                                                                               not null,
    writer_id             bigint                                                                                                                               null,
    sales_agent_id        bigint                                                                                                                               null,
    title                 varchar(255)                                                                                                                         not null,
    description           text                                                                                                                                 null,
    subject               varchar(100)                                                                                                                         null,
    academic_level        varchar(50)                                                                                                                          null,
    paper_type            varchar(50)                                                                                                                          null,
    pages                 int                                                                                                                                  not null,
    deadline              datetime                                                                                                                             not null,
    status                enum ('AVAILABLE', 'PENDING', 'IN_PROGRESS', 'IN_REVIEW', 'REVISION', 'COMPLETED', 'CANCELED', 'DISPUTED') default 'AVAILABLE'       not null,
    priority              enum ('LOW', 'MEDIUM', 'HIGH', 'URGENT')                                                                   default 'MEDIUM'          null,
    created_at            timestamp                                                                                                  default CURRENT_TIMESTAMP null,
    updated_at            timestamp                                                                                                  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    amount_paid           decimal(38, 2)                                                                                                                       null,
    citation_style        varchar(255)                                                                                                                         null,
    completed_at          datetime(6)                                                                                                                          null,
    currency              varchar(255)                                                                                                                         null,
    customer_is_returning tinyint(1)                                                                                                 default 0                 null,
    delivery_time         int                                                                                                                                  null,
    education_level       varchar(255)                                                                                                                         null,
    is_overdue            tinyint(1)                                                                                                 default 0                 null,
    is_revision           tinyint(1)                                                                                                 default 0                 null,
    language              varchar(255)                                                                                                                         null,
    pages_or_slides       int                                                                                                                                  null,
    sources_required      int                                                                                                                                  null,
    spacing               varchar(255)                                                                                                                         null,
    started_at            datetime(6)                                                                                                                          null,
    submitted_at          datetime(6)                                                                                                                          null,
    topic                 varchar(255)                                                                                                                         null,
    total_amount          decimal(38, 2)                                                                                                                       not null,
    total_bids            int                                                                                                                                  null,
    type                  varchar(255)                                                                                                                         null,
    winning_bid_id        bigint                                                                                                                               null,
    words                 int                                                                                                                                  null,
    editor_id             bigint                                                                                                                               null,
    writer_manager_id     bigint                                                                                                                               null,
    deposit_required      tinyint(1)                                                                                                 default 1                 null,
    deposit_released      tinyint(1)                                                                                                 default 0                 null,
    deposit_amount        decimal(10, 2)                                                                                                                       null,
    payment_status        enum ('NOT_PAID', 'PENDING', 'PAID', 'REFUNDED')                                                           default 'NOT_PAID'        null,
    constraint order_number
        unique (order_number),
    constraint FK47row4cse9il6vt7h8ggdowht
        foreign key (writer_manager_id) references users (id),
    constraint FKcpwoj9g0dbcphr6inkwal1oka
        foreign key (editor_id) references users (id),
    constraint orders_ibfk_1
        foreign key (customer_id) references customers (id),
    constraint orders_ibfk_2
        foreign key (writer_id) references writers (id),
    constraint orders_ibfk_3
        foreign key (sales_agent_id) references sales_agents (id)
);

create table deposit_releases
(
    id                    bigint auto_increment
        primary key,
    order_id              bigint                                                                              not null,
    amount                decimal(10, 2)                                                                      not null,
    released_to_writer_id bigint                                                                              not null,
    reason                enum ('ORDER_COMPLETED', 'ORDER_CANCELLED', 'DISPUTE_RESOLUTION', 'MANUAL_RELEASE') not null,
    released_at           datetime default CURRENT_TIMESTAMP                                                  null,
    created_at            datetime default CURRENT_TIMESTAMP                                                  null,
    constraint deposit_releases_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade,
    constraint deposit_releases_ibfk_2
        foreign key (released_to_writer_id) references writers (id)
);

create index idx_order_id
    on deposit_releases (order_id);

create index idx_writer_id
    on deposit_releases (released_to_writer_id);

create table file_attachments
(
    id          bigint auto_increment
        primary key,
    order_id    bigint                              not null,
    uploaded_by bigint                              not null,
    file_name   varchar(255)                        not null,
    file_path   varchar(500)                        not null,
    file_type   varchar(50)                         null,
    file_size   bigint                              null,
    created_at  timestamp default CURRENT_TIMESTAMP null,
    constraint file_attachments_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade,
    constraint file_attachments_ibfk_2
        foreign key (uploaded_by) references users (id)
);

create index idx_order
    on file_attachments (order_id);

create index uploaded_by
    on file_attachments (uploaded_by);

create table messages
(
    id           bigint auto_increment
        primary key,
    order_id     bigint                               not null,
    sender_id    bigint                               not null,
    receiver_id  bigint                               not null,
    message      text                                 not null,
    is_read      tinyint(1) default 0                 null,
    created_at   timestamp  default CURRENT_TIMESTAMP null,
    updated_at   datetime(6)                          null,
    message_text text                                 not null,
    read_at      datetime(6)                          null,
    constraint messages_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade,
    constraint messages_ibfk_2
        foreign key (sender_id) references users (id),
    constraint messages_ibfk_3
        foreign key (receiver_id) references users (id)
);

create index idx_order
    on messages (order_id);

create index idx_receiver
    on messages (receiver_id);

create index idx_sender
    on messages (sender_id);

create table order_bids
(
    id             bigint auto_increment
        primary key,
    order_id       bigint                                                             not null,
    writer_id      bigint                                                             not null,
    amount         decimal(10, 2)                                                     not null,
    delivery_time  int                                                                not null,
    proposal       text                                                               null,
    status         enum ('PENDING', 'ACCEPTED', 'REJECTED') default 'PENDING'         null,
    created_at     timestamp                                default CURRENT_TIMESTAMP null,
    updated_at     datetime(6)                                                        null,
    bid_amount     decimal(38, 2)                                                     not null,
    cover_letter   text                                                               null,
    currency       varchar(255)                                                       null,
    delivery_hours int                                                                not null,
    submitted_at   datetime(6)                                                        null,
    constraint order_bids_ibfk_1
        foreign key (order_id) references orders (id)
            on delete cascade,
    constraint order_bids_ibfk_2
        foreign key (writer_id) references writers (id)
);

create index idx_order
    on order_bids (order_id);

create index idx_status
    on order_bids (status);

create index idx_writer
    on order_bids (writer_id);

create table order_files
(
    id            bigint auto_increment
        primary key,
    created_at    datetime(6)          null,
    updated_at    datetime(6)          null,
    file_category varchar(255)         null,
    file_name     varchar(255)         not null,
    file_size     bigint               null,
    file_type     varchar(255)         null,
    file_url      varchar(255)         not null,
    is_seen       tinyint(1) default 0 null,
    seen_at       datetime(6)          null,
    uploaded_at   datetime(6)          null,
    order_id      bigint               not null,
    uploaded_by   bigint               not null,
    constraint FKoet3w220mrq9qtfw3u8fhhk5k
        foreign key (uploaded_by) references users (id),
    constraint FKs0kadxgnbahuj84y4o4e6s53g
        foreign key (order_id) references orders (id)
);

create index idx_customer
    on orders (customer_id);

create index idx_status
    on orders (status);

create index idx_writer
    on orders (writer_id);

create index sales_agent_id
    on orders (sales_agent_id);

create table refund_requests
(
    id          bigint auto_increment
        primary key,
    payment_id  bigint                                                                          not null,
    order_id    bigint                                                                          null,
    customer_id bigint                                                                          not null,
    reason      varchar(500)                                                                    not null,
    status      enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') default 'PENDING'         null,
    approved_by bigint                                                                          null,
    approved_at datetime                                                                        null,
    refunded_at datetime                                                                        null,
    created_at  datetime                                              default CURRENT_TIMESTAMP null,
    updated_at  datetime                                              default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint refund_requests_ibfk_1
        foreign key (payment_id) references payments (id),
    constraint refund_requests_ibfk_2
        foreign key (order_id) references orders (id)
            on delete set null,
    constraint refund_requests_ibfk_3
        foreign key (customer_id) references customers (id)
            on delete cascade
);

create index idx_created_at
    on refund_requests (created_at);

create index idx_customer_id
    on refund_requests (customer_id);

create index idx_status
    on refund_requests (status);

create index order_id
    on refund_requests (order_id);

create index payment_id
    on refund_requests (payment_id);

create table transactions
(
    id               bigint auto_increment
        primary key,
    user_id          bigint                                                                                                                                        not null,
    order_id         bigint                                                                                                                                        null,
    type             enum ('DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'COMMISSION')                                                                             not null,
    amount           decimal(38, 2)                                                                                                                                not null,
    status           enum ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') default 'PENDING'                                                                        null,
    description      text                                                                                                                                          null,
    created_at       timestamp                                            default CURRENT_TIMESTAMP                                                                null,
    updated_at       datetime(6)                                                                                                                                   null,
    currency         varchar(255)                                                                                                                                  null,
    transaction_type enum ('ORDER_PAYMENT', 'WRITER_EARNING', 'EDITOR_EARNING', 'MANAGER_EARNING', 'SALES_COMMISSION', 'WITHDRAWAL', 'REFUND', 'BONUS', 'PENALTY') not null,
    constraint transactions_ibfk_1
        foreign key (user_id) references users (id),
    constraint transactions_ibfk_2
        foreign key (order_id) references orders (id)
);

create index idx_status
    on transactions (status);

create index idx_type
    on transactions (type);

create index idx_user
    on transactions (user_id);

create index order_id
    on transactions (order_id);

