/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("example to-do app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("There are two dummy items by default", () => {
    cy.get(".todo-list li").should("have.length", 2);

    cy.get(".todo-list li").first().find("label").should("have.text", "Take out the trash");
    cy.get(".todo-list li").last().find("label").should("have.text", "Do the dishes");
  });

  it("New todos can be added to the list", () => {
    const newItem = "Mow the lawn";

    cy.get("[data-test=new-todo]").type(`${newItem}{enter}`);

    cy.get(".todo-list li")
      .should("have.length", 3)
      .last()
      .find("label")
      .should("have.text", newItem);
  });

  it("Todos can be marked as completed", () => {
    cy.contains("Take out the trash")
      .parent()
      .find("input[type=checkbox]")
      .check();

    cy.contains("Take out the trash")
      .parents("li")
      .should("have.class", "completed");
  });

  context("with a completed todo", () => {
    beforeEach(() => {
      cy.contains("Take out the trash")
        .parent()
        .find("input[type=checkbox]")
        .check();
    });

    it("can filter for incomplete todos", () => {
      cy.contains("Active").click();

      cy.get(".todo-list li")
        .should("have.length", 1)
        .first()
        .find("label")
        .should("have.text", "Do the dishes");

      cy.contains("Take out the trash").should("not.exist");
    });

    it("can filter for completed todos", () => {
      cy.contains("Completed").click();

      cy.get(".todo-list li")
        .should("have.length", 1)
        .first()
        .find("label")
        .should("have.text", "Take out the trash");

      cy.contains("Do the dishes").should("not.exist");
    });

    it("all completed todos can be removed from the list", () => {
      cy.contains("Clear completed").click();

      cy.get(".todo-list li")
        .should("have.length", 1)
        .find("label")
        .should("not.have.text", "Take out the trash");

      cy.contains("Clear completed").should("not.exist");
    });
  });
});
