
import DocsLayout from '@/components/layout/DocsLayout';
import CodeBlock from '@/components/docs/CodeBlock';
import { AlertCircle, Info, Zap } from 'lucide-react';

export default function DocsPage() {
  return (
    <DocsLayout>
      {/* ---------------- GETTING STARTED ---------------- */}
      <section id="getting-started" className="scroll-mt-24 mb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
            <Zap className="w-5 h-5 text-slate-700" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Getting Started
          </h1>
        </div>

        <div className="mb-8">
          <a 
            href="https://www.npmjs.com/package/@usepiper/sdk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors border border-slate-200"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-[#cb3837]"><path d="M2.5 0h19A2.5 2.5 0 0 1 24 2.5v19a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 21.5v-19A2.5 2.5 0 0 1 2.5 0zm1.75 3v18h3.5v-1.5h1.5V18h1.5v-1.5h1.5v-1.5h1.5v1.5h1.5V18h1.5v1.5h3.5v-15H17.5v-1.5h-3v1.5h-3v-1.5h-3V3H4.25zm5 10.5v-3h1.5v3h-1.5zm6-3v3h-1.5v-3h1.5z"></path></svg>
            @usepiper/sdk on npm
          </a>
        </div>

        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          The Piper SDK (<code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm">@usepiper/sdk</code>) provides a clean, strongly-typed interface for interacting with the Piper Protocol's smart contracts on the Sui blockchain. It abstracts away the complexity of building Programmable Transaction Blocks (PTBs) and gives you a native JavaScript/TypeScript experience for creating and managing continuous and on-demand payment streams.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          Installation
        </h2>
        <p className="text-slate-600 mb-4">
          Install the Piper SDK along with its peer dependency, the Sui TypeScript SDK:
        </p>
        <CodeBlock
          language="bash"
          code={`npm install @usepiper/sdk @mysten/sui`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          Initialization
        </h2>
        <p className="text-slate-600 mb-4">
          Before calling any functions, you should set the Package ID of the deployed Piper Move contracts. If you don't set this, the SDK defaults to the Piper Testnet package ID.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { Piper } from '@usepiper/sdk';

// Set a custom package ID for Mainnet or local development
Piper.setPackageId('0xYourCustomPackageId');`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          How It Works
        </h2>
        <p className="text-slate-600 mb-4">
          All core SDK methods are <strong>static methods</strong> on the <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">Piper</code> class. They do not sign or execute transactions on their own. Instead, they accept a <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">Transaction</code> object from <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">@mysten/sui</code> and append the required Move calls to it.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-6 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 leading-relaxed">
            This architecture ensures maximum composability, allowing you to perfectly combine Piper calls with other Sui transactions (like decentralized exchange swaps, lending operations, or NFT minting) within a single atomic transaction block.
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Basic Workflow</h3>
        <CodeBlock
          language="typescript"
          code={`import { Transaction } from '@mysten/sui/transactions';
import { Piper } from '@usepiper/sdk';

// 1. Create a new transaction block
const tx = new Transaction();

// 2. Append a Piper command to the transaction block
const stream = Piper.createContinuousStream(tx, {
    coin: '0xMyCoinObjectId',
    coinType: '0x2::sui::SUI',
    flowRate: 100, // micro-units per second
    recipient: '0xRecipientAddress'
});

// 3. Share the resulting stream object
// This is critical so the stream can be ticked autonomously by anyone!
Piper.shareStream(tx, stream, '0x2::sui::SUI');

// 4. Sign and execute using your preferred wallet method (e.g., dapp-kit)`}
        />
      </section>

      {/* ---------------- MANAGING STREAMS ---------------- */}
      <section id="managing-streams" className="scroll-mt-24 mb-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          Managing Streams
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          The Piper SDK allows you to create and manage two types of streams: <strong>Continuous Streams</strong> and <strong>On-Demand Streams</strong>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          1. Creating a Continuous Stream
        </h2>
        <p className="text-slate-600 mb-4">
          A continuous stream distributes tokens to a recipient steadily over time based on a fixed flow rate (tokens per second).
        </p>
        <CodeBlock
          language="typescript"
          code={`const stream = Piper.createContinuousStream(tx, {
    coin: '0xCoinObjectId',         // The coin object to deposit
    coinType: '0x2::sui::SUI',      // The full type of the coin
    flowRate: 100,                  // Micro-units per second
    recipient: '0xRecipientAddress' // The address receiving the stream
});

// The returned 'stream' is a TransactionResult representing the newly created Stream object.
// IMPORTANT: You must share the stream so that anyone can autonomously tick it!
Piper.shareStream(tx, stream, '0x2::sui::SUI');`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          2. Creating an On-Demand Stream
        </h2>
        <p className="text-slate-600 mb-4">
          An on-demand stream acts like an authorized allowance. It allows a specific <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">authorizedSpender</code> to pull funds up to the deposited balance, without automatically streaming over time.
        </p>
        <CodeBlock
          language="typescript"
          code={`const stream = Piper.createOnDemandStream(tx, {
    coin: '0xCoinObjectId',
    coinType: '0x2::sui::SUI',
    recipient: '0xRecipientAddress',
    authorizedSpender: '0xSpenderAddress' // The only address allowed to trigger payments
});

// Share the on-demand stream so the authorized_spender can interact with it
Piper.shareStream(tx, stream, '0x2::sui::SUI');`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          3. Ticking a Continuous Stream
        </h2>
        <p className="text-slate-600 mb-4">
          Ticking calculates the elapsed time since the last tick, deducts the accrued amount, and transfers it to the recipient. This function is <strong>permissionless</strong>; anyone can tick a stream to trigger the payout.
        </p>
        <CodeBlock
          language="typescript"
          code={`// Note: tick() returns void because it transfers the funds internally on-chain.
Piper.tick(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI'
});`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          4. Paying from an On-Demand Stream
        </h2>
        <p className="text-slate-600 mb-4">
          Paying pulls a specific amount of funds from an on-demand stream. This <strong>must</strong> be called by the <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">authorizedSpender</code> configured during stream creation.
        </p>
        <CodeBlock
          language="typescript"
          code={`Piper.pay(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI',
    amount: 5000000 // The exact micro-unit amount to pay out
});`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              5. Topping Up a Stream
            </h2>
            <p className="text-slate-600 mb-4 text-sm">
              You can add more funds to an existing stream (continuous or on-demand) without recreating it. This function is <strong>permissionless</strong>.
            </p>
            <CodeBlock
              language="typescript"
              code={`Piper.topUp(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI',
    coin: '0xAdditionalCoinObjectId'
});`}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              6. Revoking a Stream
            </h2>
            <p className="text-slate-600 mb-4 text-sm">
              The stream creator can revoke a stream at any time. This halts the stream and returns the remaining balance to the creator.
            </p>
            <CodeBlock
              language="typescript"
              code={`const remainingCoin = Piper.revoke(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI'
});

// You MUST transfer or consume the returned coin
tx.transferObjects([remainingCoin], tx.pure.address('0xYourAddress'));`}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          7. Destroying an Empty Stream
        </h2>
        <p className="text-slate-600 mb-4">
          Once a stream is completely empty (0 balance), it can be deleted from on-chain storage. This cleans up the state and refunds the object storage rebate to the transaction sponsor.
        </p>
        <CodeBlock
          language="typescript"
          code={`Piper.destroyEmpty(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI'
});`}
        />
      </section>

      {/* ---------------- REVENUE SPLITS ---------------- */}
      <section id="revenue-splits" className="scroll-mt-24 mb-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          Revenue Splits
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Splits allow stream creators to divert a percentage of the streaming output to a third-party address (e.g., a tax wallet, a platform fee wallet, or a charity).
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-slate-600 mb-8 ml-2">
          <li>Splits are evaluated <strong>automatically during every <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">tick()</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">pay()</code> call</strong>.</li>
          <li>Splits are defined by a whole percentage value (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">1</code> to <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">100</code>).</li>
          <li>The sum of all splits on a single stream cannot exceed <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">100%</code>.</li>
          <li>Only the <strong>stream creator</strong> can add or remove splits.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          Adding a Split
        </h2>
        <p className="text-slate-600 mb-4">
          Adds a new percentage-based split to the stream.
        </p>
        <CodeBlock
          language="typescript"
          code={`Piper.addSplit(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI',
    recipient: '0xTaxWalletAddress',
    percent: 10 // 10% of every payment will automatically route to this address
});`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          Finding a Split's Index
        </h2>
        <p className="text-slate-600 mb-4">
          To remove a split, you need its array index. Because the Piper SDK focuses purely on building transaction blocks, it does not fetch data from the network directly. To view the current splits and their indices, you must query the stream object from the Sui blockchain using the standard Sui client.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Fetch the Stream object from the blockchain
const streamObject = await client.getObject({
    id: '0xStreamObjectId',
    options: { showContent: true }
});

if (streamObject.data?.content?.dataType === 'moveObject') {
    // Access the splits array from the on-chain object
    const fields = streamObject.data.content.fields as any;
    const splits = fields.splits || [];

    splits.forEach((split: any, index: number) => {
        console.log(\`Index \${index}: Recipient \${split.recipient}, Percent: \${split.percent}%\`);
    });
}`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          Removing a Split
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            Once you have identified the correct index, you can remove the split from the stream. Ensure you pass the exact zero-based index.
          </div>
        </div>
        <CodeBlock
          language="typescript"
          code={`Piper.removeSplit(tx, {
    streamId: '0xStreamObjectId',
    coinType: '0x2::sui::SUI',
    index: 0 // The zero-based array index of the split to remove
});`}
        />
      </section>

      {/* ---------------- UTILITY FUNCTIONS ---------------- */}
      <section id="utility-functions" className="scroll-mt-24 pb-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          Utility Functions
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          The Piper SDK provides several helper functions to simplify math and transaction result parsing.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          <code className="bg-slate-100 text-emerald-600 px-2 py-1 rounded-md text-xl">calculateFlowRate</code>
        </h2>
        <p className="text-slate-600 mb-4">
          Flow rates on Sui are defined as the number of micro-units to transfer <strong>per second</strong>. Since humans usually think in terms of "Tokens per Month" or "Tokens per Day", <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">calculateFlowRate</code> converts total amounts and durations into the required per-second format.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { calculateFlowRate } from '@usepiper/sdk';

// Example: Stream 100 USDC over 30 days
// USDC has 6 decimals, so 100 USDC = 100,000,000 micro-units
const totalAmount = 100_000_000n;

// 30 days in seconds (30 * 24 * 60 * 60)
const durationInSeconds = 2592000; 

const flowRate = calculateFlowRate(totalAmount, durationInSeconds);

console.log(\`The required flow rate is \${flowRate} micro-units per second.\`);`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          <code className="bg-slate-100 text-emerald-600 px-2 py-1 rounded-md text-xl">extractStreamId</code>
        </h2>
        <p className="text-slate-600 mb-4">
          When you execute a transaction that creates a stream (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">createContinuousStream</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">createOnDemandStream</code>), the Piper contract emits a <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">StreamCreated</code> event.
          You can pass the final transaction result object to <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">extractStreamId</code> to reliably retrieve the ID of the newly created stream.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { extractStreamId } from '@usepiper/sdk';

// Assuming you are using @mysten/dapp-kit's signAndExecuteTransaction
const result = await client.signAndExecuteTransaction({
    signer: userSigner,
    transaction: tx,
    options: {
        showEvents: true, // IMPORTANT: You must request events from the RPC!
    }
});

// Parses the transaction events and returns the new Stream object ID
const streamId = extractStreamId(result);
console.log('Successfully created stream:', streamId);`}
        />

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4 pb-2 border-b border-slate-100">
          <code className="bg-slate-100 text-emerald-600 px-2 py-1 rounded-md text-xl">parsePiperEvents</code>
        </h2>
        <p className="text-slate-600 mb-4">
          If you need to read the complete history of events emitted by a transaction related to Piper, you can use <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm">parsePiperEvents</code>. This function filters out non-Piper events from the transaction result and returns an array of strongly-typed Piper event objects.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { parsePiperEvents } from '@usepiper/sdk';

const events = parsePiperEvents(transactionResult);

events.forEach(event => {
    if (event.type === 'PaymentSent') {
        console.log(\`Transferred \${event.parsedJson.amount} tokens to \${event.parsedJson.recipient}\`);
    } else if (event.type === 'StreamRevoked') {
        console.log(\`Stream was revoked. Remaining balance: \${event.parsedJson.returned_balance}\`);
    }
});`}
        />
      </section>
    </DocsLayout>
  );
}
