import * as fs from "fs/promises"
import * as yaml from "js-yaml"

export class IntentManager {
	private activeIntentId: string | null = null

	async selectIntent(intentId: string): Promise<string> {
		const content = await fs.readFile(".orchestration/active_intents.yaml", "utf8")
		const data = yaml.load(content) as any
		const intent = data.active_intents.find((i: any) => i.id === intentId)

		if (!intent) {
			return `ERROR: Intent ${intentId} not found in active_intents.yaml.`
		}

		this.activeIntentId = intentId

		// Context Injection: This block is returned to the AI's prompt
		return `
<intent_context>
  ACTIVE_ID: ${intent.id}
  SCOPE: ${intent.owned_scope.join(", ")}
  CONSTRAINTS: ${intent.constraints.join("; ")}
</intent_context>
        `
	}

	checkAuth(): boolean {
		return this.activeIntentId !== null
	}
}
