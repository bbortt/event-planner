#!/usr/bin/env bash
#
# The script first checks what type of component is getting stopped i.e. master or follower.
# In case the master is getting stopped – the script delays the stoppage of the pod until a previous follower gets promoted to master.
# This is done to ensure high availabiliy i.e. atleast one master with write capabilities should exist.

set -o errexit
set -o pipefail
set -o nounset

# Debug section
exec 3>&1
exec 4>&2

# Load Libraries
. /opt/bitnami/scripts/liblog.sh
. /opt/bitnami/scripts/libpostgresql.sh
. /opt/bitnami/scripts/librepmgr.sh

# Auxiliary functions
is_new_primary_ready() {
    return_value=1
    currenty_primary_node="$(repmgr_get_primary_node)"
    currenty_primary_host="$(echo $currenty_primary_node | awk '{print $1}')"

    info "$currenty_primary_host != $REPMGR_NODE_NETWORK_NAME"
    if [[ $(echo $currenty_primary_node | wc -w) -eq 2 ]] && [[ "$currenty_primary_host" != "$REPMGR_NODE_NETWORK_NAME" ]]; then
        info "New primary detected, leaving the cluster..."
        return_value=0
    else
        info "Waiting for a new primary to be available..."
    fi
    return $return_value
}

export MODULE="pre-stop-hook"

if [[ "${BITNAMI_DEBUG}" == "true" ]]; then
    info "Bash debug is on"
else
    info "Bash debug is off"
    exec 1>/dev/null
    exec 2>/dev/null
fi

# Load PostgreSQL & repmgr environment variables
. /opt/bitnami/scripts/postgresql-env.sh

postgresql_enable_nss_wrapper

# Prepare env vars for managing roles
primary_node="$(repmgr_get_primary_node)"
primary_host="$(echo $primary_node | awk '{print $1}')"

# Stop postgresql for graceful exit.
postgresql_stop

if [[ "$primary_host" == "$REPMGR_NODE_NETWORK_NAME" ]]; then
    info "Primary node need to wait for a new primary node before leaving the cluster"
    retry_while is_new_primary_ready 10 5
else
    info "Standby node doesn't need to wait, leaving the cluster."
fi
