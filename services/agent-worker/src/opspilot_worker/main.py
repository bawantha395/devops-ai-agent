"""An explicit placeholder, not a simulated live worker."""
import argparse
import json


def main():
    parser = argparse.ArgumentParser(description="OpsPilot agent worker scaffold")
    parser.add_argument("--check", action="store_true", help="Print implementation status")
    args = parser.parse_args()
    if args.check:
        print(json.dumps({"status": "not_implemented", "agent_ready": False}))
        return
    parser.exit(1, "The agent worker is not implemented. Follow docs/roadmap.md for the next milestone.\n")


if __name__ == "__main__":
    main()

