# Runbook: On-Call Checklist

Every shift:
- Check dashboard health (api/web/worker)
- Check error budget burn for current month
- Review unresolved Sentry issues
- Verify queue backlog and outbox lag
- Verify billing webhooks and payment events

Daily:
- Review security alerts and audit verification chain
- Verify backups are successful
- Confirm cert expiry > 15 days
