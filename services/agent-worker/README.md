# Agent worker

This directory is reserved for the independently deployable LangGraph worker.

The status command is implemented. Queue consumption, Bedrock calls, retrieval, tools and checkpointing are not implemented.

    python services/agent-worker/src/opspilot_worker/main.py --check

Next: implement a runbook retriever, typed investigation state and a small evaluated graph. Add durable job storage before connecting the API's investigation endpoint.

