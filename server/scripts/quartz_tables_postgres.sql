-- Define the schema
CREATE SCHEMA IF NOT EXISTS quartz_scheduler;

-- Set the schema for the session
SET search_path TO quartz_scheduler;

set client_min_messages = WARNING;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_fired_triggers;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_paused_trigger_grps;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_scheduler_state;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_locks;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_simprop_triggers;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_simple_triggers;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_cron_triggers;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_blob_triggers;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_triggers;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_job_details;
DROP TABLE IF EXISTS quartz_scheduler.qrtz_calendars;
set client_min_messages = NOTICE;

CREATE TABLE quartz_scheduler.qrtz_job_details
  (
    sched_name TEXT NOT NULL,
    job_name  TEXT NOT NULL,
    job_group TEXT NOT NULL,
    description TEXT NULL,
    job_class_name   TEXT NOT NULL, 
    is_durable BOOL NOT NULL,
    is_nonconcurrent BOOL NOT NULL,
    is_update_data BOOL NOT NULL,
    requests_recovery BOOL NOT NULL,
    job_data BYTEA NULL,
    PRIMARY KEY (sched_name,job_name,job_group)
);

CREATE TABLE quartz_scheduler.qrtz_triggers
  (
    sched_name TEXT NOT NULL,
    trigger_name TEXT NOT NULL,
    trigger_group TEXT NOT NULL,
    job_name  TEXT NOT NULL, 
    job_group TEXT NOT NULL,
    description TEXT NULL,
    next_fire_time BIGINT NULL,
    prev_fire_time BIGINT NULL,
    priority INTEGER NULL,
    trigger_state TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT NULL,
    calendar_name TEXT NULL,
    misfire_instr SMALLINT NULL,
    job_data BYTEA NULL,
    PRIMARY KEY (sched_name,trigger_name,trigger_group),
    FOREIGN KEY (sched_name,job_name,job_group) 
        REFERENCES quartz_scheduler.qrtz_job_details(sched_name,job_name,job_group) 
);

CREATE TABLE quartz_scheduler.qrtz_simple_triggers
  (
    sched_name TEXT NOT NULL,
    trigger_name TEXT NOT NULL,
    trigger_group TEXT NOT NULL,
    repeat_count BIGINT NOT NULL,
    repeat_interval BIGINT NOT NULL,
    times_triggered BIGINT NOT NULL,
    PRIMARY KEY (sched_name,trigger_name,trigger_group),
    FOREIGN KEY (sched_name,trigger_name,trigger_group) 
        REFERENCES quartz_scheduler.qrtz_triggers(sched_name,trigger_name,trigger_group) ON DELETE CASCADE
);

CREATE TABLE quartz_scheduler.QRTZ_SIMPROP_TRIGGERS 
  (
    sched_name TEXT NOT NULL,
    trigger_name TEXT NOT NULL ,
    trigger_group TEXT NOT NULL ,
    str_prop_1 TEXT NULL,
    str_prop_2 TEXT NULL,
    str_prop_3 TEXT NULL,
    int_prop_1 INTEGER NULL,
    int_prop_2 INTEGER NULL,
    long_prop_1 BIGINT NULL,
    long_prop_2 BIGINT NULL,
    dec_prop_1 NUMERIC NULL,
    dec_prop_2 NUMERIC NULL,
    bool_prop_1 BOOL NULL,
    bool_prop_2 BOOL NULL,
    time_zone_id TEXT NULL,
    PRIMARY KEY (sched_name,trigger_name,trigger_group),
    FOREIGN KEY (sched_name,trigger_name,trigger_group) 
        REFERENCES quartz_scheduler.qrtz_triggers(sched_name,trigger_name,trigger_group) ON DELETE CASCADE
);

CREATE TABLE quartz_scheduler.qrtz_cron_triggers
  (
    sched_name TEXT NOT NULL,
    trigger_name TEXT NOT NULL,
    trigger_group TEXT NOT NULL,
    cron_expression TEXT NOT NULL,
    time_zone_id TEXT,
    PRIMARY KEY (sched_name,trigger_name,trigger_group),
    FOREIGN KEY (sched_name,trigger_name,trigger_group) 
        REFERENCES quartz_scheduler.qrtz_triggers(sched_name,trigger_name,trigger_group) ON DELETE CASCADE
);

CREATE TABLE quartz_scheduler.qrtz_blob_triggers
  (
    sched_name TEXT NOT NULL,
    trigger_name TEXT NOT NULL,
    trigger_group TEXT NOT NULL,
    blob_data BYTEA NULL,
    PRIMARY KEY (sched_name,trigger_name,trigger_group),
    FOREIGN KEY (sched_name,trigger_name,trigger_group) 
        REFERENCES quartz_scheduler.qrtz_triggers(sched_name,trigger_name,trigger_group) ON DELETE CASCADE
);

CREATE TABLE quartz_scheduler.qrtz_calendars
  (
    sched_name TEXT NOT NULL,
    calendar_name  TEXT NOT NULL, 
    calendar BYTEA NOT NULL,
    PRIMARY KEY (sched_name,calendar_name)
);

CREATE TABLE quartz_scheduler.qrtz_paused_trigger_grps
  (
    sched_name TEXT NOT NULL,
    trigger_group TEXT NOT NULL, 
    PRIMARY KEY (sched_name,trigger_group)
);

CREATE TABLE quartz_scheduler.qrtz_fired_triggers 
  (
    sched_name TEXT NOT NULL,
    entry_id TEXT NOT NULL,
    trigger_name TEXT NOT NULL,
    trigger_group TEXT NOT NULL,
    instance_name TEXT NOT NULL,
    fired_time BIGINT NOT NULL,
    sched_time BIGINT NOT NULL,
    priority INTEGER NOT NULL,
    state TEXT NOT NULL,
    job_name TEXT NULL,
    job_group TEXT NULL,
    is_nonconcurrent BOOL NOT NULL,
    requests_recovery BOOL NULL,
    PRIMARY KEY (sched_name,entry_id)
);

CREATE TABLE quartz_scheduler.qrtz_scheduler_state 
  (
    sched_name TEXT NOT NULL,
    instance_name TEXT NOT NULL,
    last_checkin_time BIGINT NOT NULL,
    checkin_interval BIGINT NOT NULL,
    PRIMARY KEY (sched_name,instance_name)
);

CREATE TABLE quartz_scheduler.qrtz_locks
  (
    sched_name TEXT NOT NULL,
    lock_name  TEXT NOT NULL, 
    PRIMARY KEY (sched_name,lock_name)
);

create index idx_qrtz_j_req_recovery on quartz_scheduler.qrtz_job_details(requests_recovery);
create index idx_qrtz_t_next_fire_time on quartz_scheduler.qrtz_triggers(next_fire_time);
create index idx_qrtz_t_state on quartz_scheduler.qrtz_triggers(trigger_state);
create index idx_qrtz_t_nft_st on quartz_scheduler.qrtz_triggers(next_fire_time,trigger_state);
create index idx_qrtz_ft_trig_name on quartz_scheduler.qrtz_fired_triggers(trigger_name);
create index idx_qrtz_ft_trig_group on quartz_scheduler.qrtz_fired_triggers(trigger_group);
create index idx_qrtz_ft_trig_nm_gp on quartz_scheduler.qrtz_fired_triggers(sched_name,trigger_name,trigger_group);
create index idx_qrtz_ft_trig_inst_name on quartz_scheduler.qrtz_fired_triggers(instance_name);
create index idx_qrtz_ft_job_name on quartz_scheduler.qrtz_fired_triggers(job_name);
create index idx_qrtz_ft_job_group on quartz_scheduler.qrtz_fired_triggers(job_group);
create index idx_qrtz_ft_job_req_recovery on quartz_scheduler.qrtz_fired_triggers(requests_recovery);
