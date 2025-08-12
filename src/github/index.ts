import { BaseRepository } from "../components/base-repository";

export function setupGithub() {
  new BaseRepository("test", {
    name: "test",
    public: true,
  });

  // TODO: figure out how to import resources
  // new BaseRepository(
  //   "dotfiles",
  //   {
  //     name: "dotfiles",
  //     description: "My Dotfiles, managed using Chezmoi",
  //     public: true,
  //   },
  //   { importByName: true },
  // );
}
