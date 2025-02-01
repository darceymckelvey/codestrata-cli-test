#!/usr/bin/env node
import { program } from 'commander';
import { CommitResult, simpleGit, SimpleGit, StatusResult } from 'simple-git';

const git: SimpleGit = simpleGit();

program
    .name('strata')
    .description('Codestrata CLI for managing StrataVaults')
    .version('1.0.0');

program
    .command('create-vault')
    .description('Initialize a new StrataVault (git init)')
    .action(async () => {
        try {
            await git.init();
            console.log('🏛️  New StrataVault created successfully');
        } catch (error: any) {
            console.error('❌ Vault creation failed:', error.message);
        }
    });

program
    .command('fossilize')
    .description('Preserve code changes (git commit)')
    .argument('<message>', 'fossilization message')
    .action(async (message: string): Promise<void> => {
        try {
            const status: StatusResult = await git.status();
            if (!status.staged.length && !status.modified.length) {
                console.log('ℹ️  No changes to fossilize');
                return;
            }
            await git.add('.');
            const result: CommitResult = await git.commit(message);
            console.log('📦 Fossilized changes:', result.summary);
        } catch (error: any) {
            console.error('❌ Fossilization failed:', error.message);
        }
    });

program
    .command('stratum-shift')
    .description('Create new code layer (git branch)')
    .argument('<name>', 'shift name')
    .action(async (name: string) => {
        try {
            await git.checkoutLocalBranch(name);
            console.log(`🌿 Created new stratum: ${name}`);
        } catch (error: any) {
            console.error('❌ Stratum shift failed:', error.message);
        }
    });

program
    .command('excavate')
    .description('Check repository status')
    .action(async () => {
        try {
            const status: StatusResult = await git.status();
            console.log('\n📊 Current excavation status:');

            if (status.modified.length > 0) {
                console.log('\nModified artifacts:');
                status.modified.forEach(file => console.log(`  📝 ${file}`));
            }

            if (status.not_added.length > 0) {
                console.log('\nUntracked artifacts:');
                status.not_added.forEach(file => console.log(`  ❓ ${file}`));
            }

            if (status.staged.length > 0) {
                console.log('\nStaged artifacts:');
                status.staged.forEach(file => console.log(`  ✅ ${file}`));
            }
        } catch (error: any) {
            console.error('❌ Excavation failed:', error.message);
        }g
    });

program
    .command('uplift')
    .description('Push changes to remote (git push)')
    .argument('[remote]', 'remote name', 'origin')
    .argument('[branch]', 'branch name', 'master')
    .action(async (remote: string, branch: string) => {
        try {
            await git.push(remote, branch);
            console.log('🚀 Uplifted changes to remote vault');
        } catch (error: any) {
            console.error('❌ Uplift failed:', error.message);
        }
    });

program
    .command('connect-vault')
    .description('Connect to remote vault (git remote add)')
    .argument('<name>', 'remote name')
    .argument('<url>', 'remote vault URL')
    .action(async (name, url) => {
        try {
            await git.addRemote(name, url);
            console.log(`🔗 Connected to remote vault: ${name}`);
        } catch (error: any) {
            console.error('❌ Connection failed:', error.message);
        }
    });

program.parse();