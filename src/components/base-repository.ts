import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";
import { githubProvider } from "../provider";

const componentPrefix = "managed-repo";
const defaultBranchName = "main";

export class BaseRepository
  extends pulumi.ComponentResource<BaseRepositoryOutputs>
  implements BaseRepositoryOutputs
{
  public readonly repoName: pulumi.Output<string>;

  private readonly name: string;
  private readonly inputs: BaseRepositoryInputs;
  private readonly opts: BaseRepositoryOptions;

  protected static getDefaultOptionsIfNotOverridden(
    currentOptions?: BaseRepositoryOptions,
  ) {
    let options: BaseRepositoryOptions = {};
    if (currentOptions) {
      options = { ...currentOptions };
    }
    if (!options.provider) {
      options.provider = githubProvider;
    }
    return options;
  }

  constructor(
    name: string,
    inputs: BaseRepositoryInputs,
    opts?: BaseRepositoryOptions,
  ) {
    super(componentPrefix, name, inputs, opts);

    this.name = name;
    this.inputs = inputs;
    this.opts = BaseRepository.getDefaultOptionsIfNotOverridden(opts);

    const repo = new github.Repository(
      `${componentPrefix}:${this.name}`,
      {
        name: inputs.name,
        description: inputs.description ?? "",
        visibility: inputs.public ? "public" : "private",

        allowMergeCommit: inputs.mergeStrategy == "merge",
        allowSquashMerge: inputs.mergeStrategy == "squash",
        allowRebaseMerge: inputs.mergeStrategy == undefined,
        allowUpdateBranch: true,

        archiveOnDestroy: true,

        hasDiscussions: false,
        hasIssues: !inputs.disableIssues,
        hasProjects: false,
        hasWiki: inputs.enableWiki,

        autoInit: true,
        deleteBranchOnMerge: true,
        vulnerabilityAlerts: true,
      },
      {
        ...this.opts,
        import: this.opts.importByName
          ? `github:index/repository:Repository`
          : undefined,
        ignoreChanges: this.opts.importByName ? ["*"] : undefined,
      },
    );

    this.repoName = repo.name;

    this.configureDefaultBranch();
    this.configureTopics();
    this.configureActions();
    this.configureCollaborators();
    this.configureEnvironments();

    this.registerOutputs({
      repoName: this.repoName,
    } as BaseRepositoryOutputs);
  }

  private configureDefaultBranch() {
    const configuredDefaultBranch =
      this.inputs.defaultBranch ?? defaultBranchName;

    if (defaultBranchName !== configuredDefaultBranch) {
      // only needs to be altered if the name is not equal to the globally configured default branch name
      new github.BranchDefault(
        `${componentPrefix}:${this.name}:default-branch`,
        {
          repository: this.repoName,
          branch: defaultBranchName,
          rename: true,
        },
        this.opts,
      );
    }

    if (!this.inputs.public) {
      return;
    }

    // This is a Github Pro feature on private repositories... thus we need the early escape
    new github.BranchProtection(
      `${componentPrefix}:${this.name}:default-branch-protection`,
      {
        repositoryId: this.repoName,
        pattern: configuredDefaultBranch,
        allowsForcePushes: false,
        allowsDeletions: false,
        requireConversationResolution: true,
        requiredLinearHistory: true,
        requiredPullRequestReviews: [
          {
            requiredApprovingReviewCount: 0,
          },
        ],
      },
      this.opts,
    );

    // TODO: Probably not needed due to branch protection. Needs to be validated!
    // new github.RepositoryRuleset(
    //   `${componentPrefix}:${this.name}:default-rules`,
    //   {
    //     repository: this.repoName,
    //     enforcement: "active",
    //     target: "branch",
    //     rules: {
    //       pullRequest: {
    //         dismissStaleReviewsOnPush: true,
    //         requireLastPushApproval: true,
    //         requiredReviewThreadResolution: true,
    //       },
    //     },
    //     conditions: {
    //       refName: {
    //         excludes: [],
    //         includes: ["~DEFAULT_BRANCH"],
    //       },
    //     },
    //   },
    //   this.opts,
    // );
  }

  private configureTopics() {
    new github.RepositoryTopics(
      `${componentPrefix}:${this.name}:topics`,
      {
        repository: this.repoName,
        topics: [...(this.inputs.topics ?? []), "iac-managed"],
      },
      this.opts,
    );
  }

  private configureActions() {
    new github.ActionsRepositoryPermissions(
      `${componentPrefix}:${this.name}:actions:permissions`,
      {
        repository: this.repoName,
        enabled: true,
        allowedActions: "all", // TODO: Switch to verified/ local only?
      },
      this.opts,
    );
  }

  private configureCollaborators() {
    this.inputs.collaborators?.map(
      (collaborator) =>
        new github.RepositoryCollaborator(
          `${componentPrefix}:${this.name}:collaborator:${collaborator}`,
          {
            repository: this.repoName,
            username: collaborator,
            permission: "push", // must be push as I am only using github for myself
          },
          this.opts,
        ),
    );
  }

  private configureEnvironments() {
    this.inputs.environments?.map(
      (env) =>
        new github.RepositoryEnvironment(
          `${componentPrefix}:${this.name}:environment:${env}`,
          {
            repository: this.repoName,
            environment: env,
          },
          this.opts,
        ),
    );
  }
}

export interface BaseRepositoryInputs {
  name: string;
  description?: string;
  public?: true;
  enableWiki?: true;
  disableIssues?: true;
  mergeStrategy?: "merge" | "squash";

  defaultBranch?: string;
  topics?: string[];

  collaborators?: string[];
  environments?: string[];
}

export interface BaseRepositoryOutputs {
  repoName: pulumi.Output<string>;
}

export interface BaseRepositoryOptions extends pulumi.ComponentResourceOptions {
  importByName?: true;
}
